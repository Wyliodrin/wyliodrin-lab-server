var spawn = require('child-process-async').spawn;
var debug = require('debug')('wyliodrin-lab-server:raspberrypi');
var path = require('path');
var fs = require('fs-extra');
var crypto = require('crypto');
var pty = require('pty.js');
var _ = require('lodash');
var ip = require('ip');

var fsid = 0;

function nextFsId ()
{
	fsid++;
	return fsid;
}

function spawnPrivileged() {
	if (process.geteuid() !== 0) {
		if (!arguments[1]) arguments[1] = [];
		arguments[1].splice(0, 0, '-E', arguments[0]);
		arguments[0] = 'sudo';
	}
	return spawn.apply(this, arguments);
}

let STORAGE = path.resolve(__dirname, process.env.WYLIODRIN_LAB_STORAGE || 'storage');
let IMAGES = path.join(STORAGE, 'images');

let MOUNT = path.join(STORAGE, 'mount');
let RAM_FS = path.join(MOUNT, 'ramfs');
let BOOT = path.join(MOUNT, 'boot');
let FS = path.join(MOUNT, 'fs');
let ROOT_FS = path.join(MOUNT, 'rootfs');

let HOME = path.join (STORAGE, 'home');

let RAM_FS_SIZE = process.env.WYLIDORIN_LAB_RAM_FS_SIZE || '100M';

let FILE_SYSTEM = path.join(STORAGE, 'filesystem');
let SERVER = path.join(FILE_SYSTEM, 'server');
let COURSE = path.join(FILE_SYSTEM, 'course');
let USER = path.join(FILE_SYSTEM, 'user');

let SETUP_SERVER = path.join(MOUNT, 'server');

let SETUP_COURSE = path.join(MOUNT, 'course');

let imagesList = {};
let defaultImage = null;

var SCRIPT = process.env.WYLIODRIN_LAB_SCRIPT || path.join(__dirname, '../script');

// async function mountBoot (imageInfo, folder, unmountIfMounted = true)
// {
// 	let mount = false;
// 	folder = path.normalize(path.resolve (__dirname, folder));
// 	debug ('mount boot '+imageInfo.filename+' to '+folder);
// 	try
// 	{
// 		let res = await spawnPrivileged ('mount', ['--read-only', '-o', 'loop,offset='+(imageInfo.fat.offset*512)+',sizelimit='+(imageInfo.fat.sectors*512), imageInfo.filename, folder]);
// 		// console.log (['mount', '-o', 'loop,offset='+(imageInfo.fat.offset*512)+',sizelimit='+(imageInfo.fat.sectors*512), imageInfo.filename, folder]);
// 		if (res.exitCode !== 0)
// 		{
// 			if (unmountIfMounted && res.stderr.indexOf ('already mounted'))
// 			{
// 				debug ('mount: '+folder+' is already mounted, trying to umount');
// 				await unmount (folder);
// 				await mountBoot (imageInfo, folder, false);
// 			}
// 			else
// 			{
// 				console.error ('ERROR: '+res.stderr.toString ());
// 			}
// 		}
// 		else 
// 		{
// 			imageInfo.bootFolder = folder;
// 			mount = true;
// 		}
// 	}
// 	catch (e)
// 	{
// 		console.error ('ERROR: mount boot for '+imageInfo.filename+' failed ('+e.message+')');
// 	}
// 	return mount;
// }

async function unmount(folder) {
	let umount = false;
	debug('umount ' + folder);
	try {
		let res = await spawnPrivileged('umount', [folder]);
		// console.log (res.stdout.toString());
		// console.log (res.stderr.toString());
		// console.log (res);
		if (res.exitCode !== 0) {
			console.error('ERROR: ' + res.exitCode + ' ' + res.stderr.toString());
		} else {
			umount = true;
			// TODO remove mount folder
		}
	} catch (e) {
		console.error('ERROR: umount for ' + folder + ' failed (' + e.message + ')');
	}
	return umount;
}

async function mountRamFs (boardId)
{
	let folder = path.join (RAM_FS, boardId);
	await fs.mkdirs (folder); 
	await spawnPrivileged ('umount', [folder]);
	await spawnPrivileged ('mount', ['-t', 'tmpfs', '-o', 'size='+RAM_FS_SIZE, 'none', folder]);
}

async function mountPartition(imageInfo, partition, folder, unmountIfMounted = false) {
	let mount = false;
	folder = path.normalize(path.resolve(__dirname, folder));
	if (imageInfo[partition]) {
		debug('mount ' + partition + ' ' + imageInfo.filename + ' to ' + folder);
		try {
			let mounted = await isMounted(folder);
			if (mounted && unmountIfMounted) {
				await unmount(folder);
				mounted = false;
			}
			if (!mounted) {
				await fs.mkdirs(folder);
				let res = await spawnPrivileged('mount', ['--read-only', '-o', 'loop,offset=' + (imageInfo[partition].offset * 512) + ',sizelimit=' + (imageInfo[partition].sectors * 512), imageInfo.filename, folder]);
				// console.log (['mount', '-o', 'loop,offset='+(imageInfo.fat.offset*512)+',sizelimit='+(imageInfo.fat.sectors*512), imageInfo.filename, folder]);
				if (res.exitCode !== 0) {
					console.error('ERROR: mount ' + partition + ' for ' + imageInfo.filename + ' failed (' + res.stderr.toString() + ')');
				} else {
					imageInfo[partition + 'Folder'] = folder;
					mount = true;
				}
			} else {
				mount = true;
			}
		} catch (e) {
			console.error('ERROR: mount ' + partition + ' for ' + imageInfo.filename + ' failed (' + e.message + ')');
		}
	} else {
		console.error('ERROR: partition ' + partition + 'does not exist');
	}
	return mount;
}

function sha1(str) {
	let shasum = crypto.createHash('sha1');
	shasum.update(str);
	return shasum.digest('hex');
}

function readSectors(partition) {
	let sectors = null;
	let matchStartSector = partition.match(/startsector\s+([0-9]+)/);
	// console.log (matchStartSector);
	let matchSectors = partition.match(/([0-9]+)\s+sectors/);
	// console.log (matchSectors);
	if (matchStartSector && matchSectors) {
		sectors = {
			offset: parseInt(matchStartSector[1]),
			sectors: parseInt(matchSectors[1])
		};
	}
	return sectors;
}

function splitImageInfo(str) {
	let information = {};
	let data = str.split(';');
	if (data.length >= 3) {
		let mbr = data[0];
		let fat = data[1];
		let ext3 = data[2];
		if (mbr.indexOf('DOS/MBR boot sector') >= 0) {
			if (fat.indexOf('ID=0xc') >= 0) {
				information.fat = readSectors(fat);
			} else {
				console.error('ERROR: no FAT partition found (' + fat + ')');
			}
			if (ext3.indexOf('ID=0x83') >= 0) {
				information.ext3 = readSectors(ext3);
			} else {
				console.error('ERROR: no FAT partition found (' + fat + ')');
			}
		} else {
			console.error('ERROR: no MBR sector found (' + mbr + ')');
		}
	}
	if (information.fat && information.ext3) {
		return information;
	} else return null;
}

async function readImageInfo(filename) {
	var imageInfo = null;
	try {
		filename = path.normalize(path.resolve(__dirname, filename));
		if (await fs.exists(filename)) {
			var data = await spawn('file', ['-b', filename]);
			if (data.exitCode === 0 && data.stderr.toString() === '') {
				let stdout = data.stdout.toString();
				imageInfo = splitImageInfo(stdout);
				if (imageInfo) {
					imageInfo.id = sha1(filename);
					imageInfo.filename = filename;
				} else {
					console.error('ERROR: image does not have an MBR, FAT and EXT3 partition');
				}
			} else {
				console.error('ERROR: Image file ' + filename + ' is not a Raspberry Pi Image ' + data.stderr);
			}
		} else {
			console.error('ERROR: Image file ' + filename + ' does not exist');
		}
	} catch (e) {
		console.error('ERROR: Image file ' + filename + ' is not a Raspberry Pi Image (' + e.message + ')');
	}
	return imageInfo;
}

async function isMounted(folder) {
	let mount = await spawn('bash', ['-c', 'mount | cut -d \' \' -f 3']);
	let folders = mount.stdout.toString().split('\n');
	// console.log (mount.stdout.toString());
	// console.log (folders);
	if (_.indexOf(folders, folder) >= 0) return true;
	else return false;
}

async function mountAufs(stack, folder, options, unmountIfMounted = false) {
	folder = path.normalize(path.resolve(__dirname, folder));
	let mount = false;
	debug('mount aufs ' + stack + ' ' + folder);
	try {
		let mounted = await isMounted(folder);
		if (mounted && unmountIfMounted) {
			await unmount(folder);
			mounted = false;
		}
		if (!mounted) {
			await fs.mkdirs(folder);
			console.log(stack);
			let mnt = await spawnPrivileged('mount', ['-t', 'aufs', '-o', 'br=' + stack.join(':') + (options ? ',' + options.join(',') : ''), 'none', folder]);
			console.log('mount ' + ['-t', 'aufs', '-o', 'br=' + stack.join(':') + (options ? ',' + options.join(',') : ''), 'none', folder].join(' '));
			// console.log (mnt.stdout.toString  ());
			// console.log (mnt.stderr.toString  ());
			// console.log (mnt.exitCode);
			if (mnt.exitCode !== 0) {
				console.error('ERROR: mount aufs ' + stack + ' to ' + folder + ' failed (' + mnt.stderr.toString() + ')');
			} else {
				mount = true;
			}
		} else {
			mount = true;
		}
	} catch (e) {
		console.error('ERROR: mount aufs ' + stack + ' to ' + folder + ' failed (' + e.message + ')');
	}
	return mount;
}

async function mountImage(imageInfo) {
	let mount = false;
	// console.log (imageInfo);
	if (imageInfo) {
		let folderBoot = path.join(BOOT, imageInfo.id);
		let folderFs = path.join(FS, imageInfo.id);
		mount = await mountPartition(imageInfo, 'fat', folderBoot);
		if (mount) {
			mount = await mountPartition(imageInfo, 'ext3', folderFs);
			if (!mount) unmount(folderBoot);
		}
		if (!mount) imageInfo = null;
	}
	return imageInfo;
}

async function serverStack(imageInfo) {
	let fsFolder = path.join(FS, imageInfo.id);
	let folderServer = path.join(SERVER, imageInfo.id);
	await fs.mkdirs(folderServer);
	return [folderServer, fsFolder];
}

async function setupServer(imageInfo) {
	let folderStack = await serverStack(imageInfo);
	let folderSetup = path.join(SETUP_SERVER, imageInfo.id);
	// await fs.mkdirs (folderSetup);
	// TODO if is mounted
	if (await isMounted(folderSetup)){
		await unmount (folderSetup);
	}
	try {
		if (await mountAufs(folderStack, folderSetup, ['suid'])) {
			let setup = await spawnPrivileged('bash', [path.join(SCRIPT, 'setup.sh'), folderSetup]);
			// mount /proc
			await spawnPrivileged('mount', ['-t', 'proc', '/proc', path.join(folderSetup, 'proc')]);
			if (setup.exitCode === 0) {
				// process.exit (0);
				console.log(process.env);
				let install = spawnPrivileged('chroot', ['--userspec', 'pi:pi', folderSetup, '/bin/bash', 'install.sh'], {
					env: _.assign({}, process.env, {
						HOME: '/home/pi',
						USER: 'pi',
						USERNAME: 'pi',
						HOSTNAME: 'raspberrypi'
					})
				});
				install.stdout.on('data', function(data) {
					process.stdout.write(data);
				});
				install.stderr.on('data', function(data) {
					process.stderr.write(data);
				});
				await install;
			} else {
				throw new Error('setup: ' + setup.stderr.toString());
			}
		} else {
			console.error('ERROR: setup server for ' + imageInfo.id + ' failed (unable to mount setup folder)');
		}

	} catch (e) {
		console.log(e);
		console.error('ERROR: setup server for ' + imageInfo.id + ' failed (' + e.message + ')');
	}
	await spawnPrivileged('umount', [path.join(folderSetup, 'proc')]);
	await unmount(folderSetup);
}

async function mountSetupCourse(courseId, imageInfo) {
	let mount = false;
	// TODO get image info
	let folderCourse = path.join(COURSE, courseId);
	await fs.mkdirs(folderCourse);
	let folderStack = [folderCourse, ...await serverStack(imageInfo)];
	let folderSetupCourse = path.join(SETUP_COURSE, courseId);
	if (await mountAufs(folderStack, folderSetupCourse, ['suid'])) {
		// mount /proc
		await spawnPrivileged('mount', ['-t', 'proc', '/proc', path.join(folderSetupCourse, 'proc')]);
		mount = true;
	} else {
		console.error('mount setup course for ' + imageInfo.id + ':' + courseId + ' failed (unable to mount course file system)');
	}
	return mount;
}

async function unmountSetupCourse(courseId) {
	let folderSetupCourse = path.join(SETUP_COURSE, courseId);
	// umount /proc
	await unmount(path.join(folderSetupCourse, 'proc'));
	return await unmount(folderSetupCourse);
}

async function setupCourse(courseId, imageInfo, userList, emitString ,cmd = 'bash', cols = 80, rows = 24) {
	if (!imageInfo) {
		debug('mount root fs using default image id ' + defaultImage.id);
		imageInfo = defaultImage;
	}
	if (await mountSetupCourse(courseId, imageInfo)) {
		let folderSetupCourse = path.join(SETUP_COURSE, courseId);
		let command = 'chroot';
		let params = ['--userspec', 'pi:pi', folderSetupCourse, cmd];
		if (process.geteuid() !== 0) {
			params.splice(0, 0, command);
			command = 'sudo';
		}
		let run = pty.spawn(command, params, {
			rows,
			cols,
			HOME: '/home/pi',
			USER: 'pi',
			USERNAME: 'pi'
		});
		run.on('exit', async function(exitCode) {
			let toSend = {t:'s', a:'c', b:courseId};
			userList.emit(emitString, toSend);

			debug('setup course ' + exitCode);
			await unmountSetupCourse(courseId);
		});
		run.on('data', function(data){
			let toSend = {t:'s', a:'k', b:courseId, c:data};
			userList.emit(emitString, toSend);
		});
		run.on ('error', function (error)
		{
			if (error.message.indexOf ('EIO') === -1)
			{
				console.log ('SHELL '+error.message);
			}
		});
		return run;
	} else {
		console.error('ERROR: setup course mount fs failed');
		return null;
	}
}

async function mountRootFs(boardId, userId, courseId, imageInfo) {
	// TODO get userId, courseId, image info
	if (!imageInfo) {
		debug('mount root fs using default image id ' + defaultImage.id);
		imageInfo = defaultImage;
	}
	if (userId && courseId) {
		let folderRoot = path.join(USER, courseId, userId);
		let folderCourse = path.join(COURSE, courseId);
		let folderStack = [folderRoot, folderCourse, ...await serverStack(imageInfo)];
		let folderRootFs = path.join(ROOT_FS, boardId);
		await fs.mkdirs(folderRoot);
		await fs.mkdirs(folderCourse);
		await fs.mkdirs(folderRootFs);
		if (await mountAufs(folderStack, folderRootFs, ['rw,suid'])) {
			// export nfs
			return true;
		} else {
			console.error('mount root fs for ' + imageInfo.id + ':' + courseId + ':' + userId + ' faliled (unable to mount course file system)');
		}
	} else {
		let folderRamFs = path.join(RAM_FS, boardId);
		await mountRamFs(boardId);
		let folderStack = [folderRamFs, ...await serverStack(imageInfo)];
		let folderRootFs = path.join(ROOT_FS, boardId);
		await fs.mkdirs(folderRootFs);
		if (await mountAufs(folderStack, folderRootFs, ['rw'])) {
			// export nfs
			return true;
		} else {
			console.error('mount root fs for ' + imageInfo.id + ':' + courseId + ':' + userId + ' faliled (unable to mount course file system)');
		}
	}
	return false;
}

async function unmountRootFs(boardId) {
	// unexport fs
	let folderRamFs = path.join(RAM_FS, boardId);
	let folderRootFs = path.join(ROOT_FS, boardId);
	// umount /proc
	if (isMounted(folderRootFs)){
		await unmount(folderRootFs);
	}
	if (isMounted(folderRamFs)){
		await unmount(folderRamFs);
	}
	// TODO modify this
	return true;
}

function exportFs(path, options) {
	let params = ['*:' + path];
	if (options) params.push('-o', options.join(','));
	// TODO verify errors
	return spawnPrivileged('exportfs', params);
}

function unexportFs(path) {
	// TODO verify errors
	return spawnPrivileged('exportfs', ['-u', '*:' + path]);
}

async function listExportFs() {
	let list = [];
	try {
		let run = await spawnPrivileged('exportfs', ['-v']);
		if (run.exitCode === 0) {
			let rawData = run.stdout.toString().split('\n');
			let data = [];
			for (let index = 0; index < rawData.length; index ++)
			{
				let rawItem = rawData[index];
				if (rawItem[0] === '\t' || rawItem[0]===' ' && data.length>0)
				{
					data[data.length-1] = data[data.length-1]+' '+rawItem;
				}
				else
				{
					data.push (rawItem);
				}
			}
			for (let item of data) {
				if (item.length > 0) {
					let dataItem = item.split(/\s+/);
					// console.log (dataItem[1]);
					let optionsItem = [];
					let matchOptions = dataItem[1].match(/\*\(([^)]+)\)/);
					if (matchOptions) optionsItem = matchOptions[1].split(',');
					let exportItem = {
						folder: dataItem[0],
						options: optionsItem
					};
					list.push(exportItem);
				}
			}
		} else {
			throw new Error('list export ' + run.stderr.toString());
		}
	} catch (e) {
		console.error('ERROR: list export unable to list exports (' + e.message + ')');
	}
	return list;
}

async function readImages() {
	imagesList = {};
	try {
		await fs.mkdirs(IMAGES);
		let list = await fs.readdir(IMAGES);
		for (let file of list) {
			if (path.extname(file) === '.img') {
				debug('Found image ' + path.join(IMAGES, file));
				try {
					let imageInfo = await readImageInfo(path.join(IMAGES, file));
					imagesList[imageInfo.id] = imageInfo;
					if (!defaultImage) defaultImage = imageInfo;
					if (file.indexOf('default') >= 0) defaultImage = imageInfo;
					mountImage(imageInfo);
				} catch (e) {
					console.error('ERROR: read image (' + e.message + ')');
				}
			}
		}
	} catch (e) {
		console.error('ERROR: read images (' + e.message + ')');
	}
	if (!defaultImage) console.error('ERROR: load images there is no default image');
}

function listImages() {
	return _.cloneDeep(imagesList);
}

function listImagesAsArray() {
	let list = [];
	for (let image in imagesList) {
		list.push(_.cloneDeep(imagesList[image]));
	}
	return list;
}

async function isExported(folder) {
	let exportList = await listExportFs();
	for (let exportItem of exportList) {
		if (exportItem.folder === folder) return true;
	}
	return false;
}

function hasRootFsMounted(boardId) {
	return isExported(pathRootFs(boardId));
}

async function setup(boardId, userId, courseId, imageId) {
	if (!imageId) imageId = defaultImageId();
	if (imagesList[imageId]) {
		let folder = path.join(ROOT_FS, boardId);
		if (!await isExported(folder)) {
			let mount = await mountRootFs(boardId, userId, courseId, imagesList[imageId]);
			// console.log (mount);
			if (mount) {
				let read = 'rw';
				// if (!userId || !courseId) read = 'ro';
				if (userId) await exportFs (await pathUser (userId, true), ['fsid='+nextFsId(), read, 'all_squash', 'anonuid=1000', 'anongid=1000']);
				let exp = await exportFs(folder, ['fsid='+nextFsId(), read, 'no_root_squash']);
				if (!exp) {
					await unmountRootFs(boardId);
					throw new Error('Failed to export rootfs for image ' + imageId);
				} else {
					return true;
				}
			} else {
				throw new Error('Failed to mount rootfs for image ' + imageId);
			}
		} else {
			throw new Error('Board ' + boardId + ' is already setup');
		}
	} else throw new Error('Image ' + imageId + ' does not exist');
}

async function unsetup(boardId) {
	let folder = path.join(ROOT_FS, boardId);
	if (await isExported(folder)) {
		await unexportFs(folder);
		await unmountRootFs(boardId);
		return true;
	} else {
		throw new Error('Board ' + boardId + ' is not setup');
	}
}


function hasSetup(boardId) {
	return hasRootFsMounted(boardId);
}

async function run() {
	await readImages();
	// console.log (imagesList);
	// console.log (listImagesAsArray());
	// await unsetup ('board1');
	// await setup ('board1', 'user1', 'course1', '212b3209ec67bf6728d14a16d4ad47e4acabac4c');
	// console.log (await listExportFs ());
	// let imageInfo = await mountImage ('../../../../../Downloads/2018-04-18-raspbian-stretch-lite.img');
	// let imageInfo = await mountImage ('../../../../Downloads/2018-06-27-raspbian-stretch-lite.img');
	// console.log (imageInfo);
	// await mountPartition (imageInfo, 'fat', 'fat');
	// await mountPartition (imageInfo, 'ext3', 'ext3');
	// await setupServer (defaultImage);
	// await unmount (imageInfo.bootFolder);
	// await unmount (imageInfo.fsFolder);
}

/*
parameters
{
	serverIp: server_ip // null for autodetect
}
*/
async function cmdline(courseId, imageId, boardId, userId, parameters) {
	// TODO debug using default image
	if (!imageId) imageId = defaultImageId();
	if (!parameters) parameters = {};
	if (!parameters.server) parameters.server = 'http://'+ip.address();
	if (!parameters.nfsServer) parameters.nfsServer = ip.address ();
	let str = 'root=/dev/nfs nfsroot=' + parameters.nfsServer + ':' + path.join(ROOT_FS, boardId) + ',vers=3 rw ip=dhcp rootwait elevator=deadline userId='+userId+' server='+parameters.server+' courseId='+courseId;
	let folderBoot = path.join(BOOT, imageId);
	let cmdline = (await fs.readFile(path.join(folderBoot, 'cmdline.txt'))).toString();
	let pos = cmdline.indexOf('root=');
	if (pos >= 0) {
		cmdline = cmdline.substr(0, pos) + str;
	} else {
		cmdline = cmdline + ' ' + str;
	}
	return cmdline;
}

function defaultImageId() {
	if (!defaultImage) {
		console.error('ERROR: there is no default image');
		return null;
	} else {
		return defaultImage.id;
	}
}

async function setupUser (userId)
{
	let folderFs = path.join (FS, defaultImageId ());
	let folderUser = path.join (HOME, userId);
	await spawnPrivileged ('bash', ['-c', 'cp '+folderFs+'/home/pi/* '+folderUser+' && chown -R 1000:1000 *']);
}

async function pathUser (userId, write = false)
{
	let folder = path.join (HOME, userId);
	if (write) 
	{
		await fs.mkdirs (folder);
		if (!await fs.exists (path.join (HOME, '.profile'))) 
		{
			await setupUser (userId);
		}
		// TODO is recursive useful?
		await spawnPrivileged ('chown', ['-R', '1000:1000', folder]);
	}
	return folder;
}

function pathHomes ()
{
	return HOME;
}

function pathBoot(id) {
	// TODO debug using default image
	if (!id) id = defaultImage.id;
	return path.join(BOOT, id);
}

function pathRootFs(id) {
	// TODO debug using default image
	if (!id) id = defaultImage.id;
	return path.join(ROOT_FS, id);
}

run();

process.on('exit', function() {
	// TODO unexport all images
});

// TODO export install image instead of this
module.exports.setupServer = setupServer;

module.exports.listImages = listImages;
module.exports.listImagesAsArray = listImagesAsArray;
module.exports.setup = setup;
module.exports.unsetup = unsetup;
module.exports.setupCourse = setupCourse;

module.exports.cmdline = cmdline;

module.exports.defaultImageId = defaultImageId;

module.exports.pathBoot = pathBoot;
module.exports.pathRootFs = pathRootFs;
module.exports.pathUser = pathUser;
module.exports.pathHomes = pathHomes;

module.exports.hasSetup = hasSetup;