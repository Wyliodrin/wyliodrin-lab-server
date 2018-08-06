var spawn = require ('child-process-async').spawn;
var debug = require ('debug')('wyliodrin-lab-server:raspberrypi');
var path = require ('path');
var fs = require ('fs-extra');
var crypto = require ('crypto');
var pty = require ('pty.js');

function spawnPrivileged ()
{
	if (process.geteuid () !== 0)
	{
		if (!arguments[1]) arguments[1] = [];
		arguments[1].splice (0, 0, arguments[0]);
		arguments[0] = 'sudo';
	}
	return spawn.apply (this, arguments);
}

let STORAGE = path.resolve (__dirname, process.env.WYLIODRIN_LAB_STORAGE || 'storage');
// let IMAGES = path.join (STORAGE, 'images');

let MOUNT = path.join (STORAGE, 'mount');
let BOOT = path.join (MOUNT, 'boot');
let FS = path.join (MOUNT, 'fs');
let ROOT_FS = path.join (MOUNT, 'rootfs');

let FILE_SYSTEM = path.join (STORAGE, 'filesystem');
let SERVER = path.join (FILE_SYSTEM, 'server');
let COURSE = path.join (FILE_SYSTEM, 'course');
let USER = path.join (FILE_SYSTEM, 'user');

let SETUP_SERVER = path.join (MOUNT, 'server');

let SETUP_COURSE = path.join (MOUNT, 'course');

var SCRIPT = process.env.WYLIODRIN_LAB_SCRIPT || path.join (__dirname, 'script');

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

async function unmount (folder)
{
	let umount = false;
	debug ('umount ' + folder);
	try
	{
		let res = await spawnPrivileged ('umount', [folder]);
		// console.log (res.stdout.toString());
		// console.log (res.stderr.toString());
		// console.log (res);
		if (res.exitCode !== 0)
		{
			console.error ('ERROR: '+res.exitCode+' '+res.stderr.toString ());
		}
		else 
		{
			umount = true;
			// TODO remove mount folder
		}
	}
	catch (e)
	{
		console.error ('ERROR: umount for '+folder+' failed ('+e.message+')');
	}
	return umount;
}

async function mountPartition (imageInfo, partition, folder, unmountIfMounted = false)
{
	let mount = false;
	folder = path.normalize(path.resolve (__dirname, folder));
	if (imageInfo[partition])
	{
		debug ('mount '+partition+' '+imageInfo.filename+' to '+folder);
		try
		{
			await fs.mkdirs (folder);
			let res = await spawnPrivileged ('mount', ['--read-only', '-o', 'loop,offset='+(imageInfo[partition].offset*512)+',sizelimit='+(imageInfo[partition].sectors*512), imageInfo.filename, folder]);
			// console.log (['mount', '-o', 'loop,offset='+(imageInfo.fat.offset*512)+',sizelimit='+(imageInfo.fat.sectors*512), imageInfo.filename, folder]);
			if (res.exitCode !== 0)
			{
				if (res.stderr.indexOf ('already mounted') >= 0)
				{
					if (unmountIfMounted)
					{
						debug ('mount: '+folder+' is already mounted, trying to umount');
						await unmount (folder);
						mount = await mountPartition (imageInfo, partition, folder, false);
					}
					else
					{
						mount = true;
					}
				}
				else
				{
					console.error ('ERROR: mount '+partition+' for '+imageInfo.filename+' failed ('+res.stderr.toString()+')');
				}
			}
			else 
			{
				imageInfo[partition+'Folder'] = folder;
				mount = true;
			}
		}
		catch (e)
		{
			console.error ('ERROR: mount '+partition+' for '+imageInfo.filename+' failed ('+e.message+')');
		}
	}
	else
	{
		console.error ('ERROR: partition ' + partition + 'does not exist');
	}
	return mount;
}

function sha1 (str)
{
	let shasum = crypto.createHash ('sha1');
	shasum.update (str);
	return shasum.digest ('hex');
}

function readSectors (partition)
{
	let sectors = null;
	let matchStartSector = partition.match (/startsector\s+([0-9]+)/);
	// console.log (matchStartSector);
	let matchSectors = partition.match (/([0-9]+)\s+sectors/);
	// console.log (matchSectors);
	if (matchStartSector && matchSectors)
	{
		sectors = {
			offset: parseInt (matchStartSector[1]),
			sectors: parseInt (matchSectors[1])
		};
	}
	return sectors;
}

function splitImageInfo (str)
{
	let information = {
	};
	let data = str.split (';');
	if (data.length >= 3)
	{
		let mbr = data[0];
		let fat = data[1];
		let ext3 = data[2];
		if (mbr.indexOf ('DOS/MBR boot sector')>=0)
		{
			if (fat.indexOf ('ID=0xc')>=0)
			{
				information.fat = readSectors (fat);
			}
			else
			{
				console.error ('ERROR: no FAT partition found ('+fat+')');	
			}
			if (ext3.indexOf ('ID=0x83')>=0)
			{
				information.ext3 = readSectors (ext3);
			}
			else
			{
				console.error ('ERROR: no FAT partition found ('+fat+')');	
			}
		}
		else
		{
			console.error ('ERROR: no MBR sector found ('+mbr+')');
		}
	}
	if (information.fat && information.ext3)
	{
		return information;
	}
	else return null;
}

async function readImageInfo (filename)
{
	var imageInfo = null;
	try
	{
		filename = path.normalize (path.resolve (__dirname, filename));
		if (await fs.exists (filename))
		{
			var data = await spawn ('file', ['-b', filename]);
			if (data.exitCode === 0 && data.stderr.toString () === '')
			{
				let stdout = data.stdout.toString ();
				imageInfo = splitImageInfo (stdout);
				if (imageInfo)
				{
					imageInfo.id = sha1 (filename);
					imageInfo.filename = filename;
				}
				else
				{
					console.error ('ERROR: image does not have an MBR, FAT and EXT3 partition');
				}
			}
			else
			{
				console.error ('ERROR: Image file '+filename+' is not a Raspberry Pi Image '+data.stderr);
			}
		}
		else
		{
			console.error ('ERROR: Image file '+filename+' does not exist');
		}
	}
	catch (e)
	{
		console.error ('ERROR: Image file '+filename+' is not a Raspberry Pi Image ('+e.message+')');
	}
	return imageInfo;
}

async function mountAufs (stack, folder, options, unmountIfMounted = false)
{
	folder = path.normalize (path.resolve(__dirname, folder));
	let mount = false;
	debug ('mount aufs '+stack+' '+folder);
	try
	{
		await fs.mkdirs (folder);
		let mnt = await spawnPrivileged ('mount', ['-t', 'aufs', '-o', 'br='+stack.join(':')+(options?','+options.join(','):''), 'none', folder]);
		// console.log (mnt.stderr.toString  ());
		if (mnt.exitCode !== 0)
		{
			if (mnt.stderr.indexOf ('already mounted') >= 0)
			{
				if (unmountIfMounted)
				{
					debug ('mount aufs '+folder+' is already mounted, trying to umount');
					await unmount (folder);
					mount = await mountAufs (stack, folder, options, false);
				}
				else
				{
					mount = true;
				}
			}
			else
			{
				console.error ('ERROR: mount aufs '+stack+' to '+folder+' failed ('+mnt.stderr.toString()+')');
			}
		}
		else
		{
			mount = true;
		}
	}
	catch (e)
	{
		console.error ('ERROR: mount aufs '+stack+' to '+folder+' failed ('+e.message+')');
	}
	return mount;
}

async function mountImage (filename)
{
	debug ('read image '+filename);
	let mount = false;
	let imageInfo = await readImageInfo (filename);
	// console.log (imageInfo);
	if (imageInfo)
	{
		let folderBoot = path.join (BOOT, imageInfo.id);
		let folderFs = path.join (FS, imageInfo.id);
		mount = await mountPartition (imageInfo, 'fat', folderBoot);
		if (mount)
		{
			mount = await mountPartition (imageInfo, 'ext3', folderFs);
			if (!mount) unmount (folderBoot);
		}
		if (!mount) imageInfo = null;
	}
	return imageInfo;
}

async function serverStack (imageInfo)
{
	let fsFolder = path.join (FS, imageInfo.id);
	let folderServer = path.join (SERVER, imageInfo.id);
	await fs.mkdirs (folderServer);
	return [folderServer, fsFolder];
}

async function setupServer (imageInfo)
{
	let folderStack = await serverStack (imageInfo);
	let folderSetup = path.join (SETUP_SERVER, imageInfo.id);
	// await fs.mkdirs (folderSetup);
	// TODO if is mounted
	// await unmount (folderSetup);
	try
	{
		if (await mountAufs (folderStack, folderSetup, ['suid']))
		{
			let setup = await spawnPrivileged ('bash', [path.join (SCRIPT, 'setup.sh'), folderSetup]);
			// mount /proc
			await spawnPrivileged ('mount', ['-t', 'proc', '/proc', path.join (folderSetup, 'proc')]);
			if (setup.exitCode === 0)
			{
				let install = spawnPrivileged ('chroot', ['--userspec', 'pi:pi',  folderSetup, '/bin/bash', 'install.sh'], {
					env: {
						HOME: '/home/pi',
						USER: 'pi',
						USERNAME: 'pi',
						HOSTNAME: 'raspberrypi'
					}
				});
				install.stdout.on ('data', function (data)
				{
					process.stdout.write (data);
				});
				install.stderr.on ('data', function (data)
				{
					process.stderr.write (data);
				});
				await install;
			}
			else
			{
				throw new Error ('setup: '+setup.stderr.toString());
			}
		}
		else
		{
			console.error ('ERROR: setup server for '+imageInfo.id+' failed (unable to mount setup folder)');
		}

	}
	catch (e)
	{
		console.error ('ERROR: setup server for '+imageInfo.id+' failed ('+e.message+')');
	}
	await spawnPrivileged ('umount', [ path.join (folderSetup, 'proc')]);
	await unmount (folderSetup);
}

async function mountSetupCourse (courseId, imageInfo)
{
	let mount = false;
	// TODO get image info
	let folderCourse= path.join (COURSE, courseId);
	let folderStack = [folderCourse, ...await serverStack (imageInfo)];
	let folderSetupCourse = path.join (SETUP_COURSE, courseId);
	if (await mountAufs (folderStack, folderSetupCourse, ['suid']))
	{
		// mount /proc
		await spawnPrivileged ('mount', ['-t', 'proc', '/proc', path.join (folderSetupCourse, 'proc')]);
		mount = true;
	}
	else
	{
		console.error ('mount setup course for '+imageInfo.id+':'+courseId+' faliled (unable to mount course file system)')
	}
	return mount;
}

async function unmountSetupCourse (courseId)
{
	let folderSetupCourse = path.join (SETUP_COURSE, courseId);
	// umount /proc
	await spawnPrivileged ('mount', [path.join (folderSetupCourse, 'proc')]);
	return await unmount (folderSetupCourse);
}

async function setupCourse (courseId, imageInfo, cmd = 'bash', tty = true, cols = 80, rows = 24)
{
	// TODO get image info
	if (await mountSetupCourse (courseId, imageInfo))
	{
		let folderSetupCourse = path.join (SETUP_COURSE, courseId);
		let command = 'chroot';
		let params = ['--userspec', 'pi:pi', folderSetupCourse, cmd];
		if (process.geteuid () !== 0)
		{
			params.splice (0, 0, command);
			command = 'sudo';
		}
		let run = pty.spawn (command, params, {
			rows,
			cols,
			HOME: '/home/pi',
			USER: 'pi',
			USERNAME: 'pi'
		});
		run.on ('exit', async function (exitCode)
		{
			debug ('setup course '+exitCode);
			await unmount (folderSetupCourse);
		});
		return run;
	}
	else
	{
		console.error ('ERROR: setup course mount fs failed');
		return null;
	}
}

async function mountRootFs (boardId, userId, courseId, imageInfo)
{
	// TODO get userId, courseId, image info
	let folderRoot= path.join (USER, userId, courseId);
	let folderCourse= path.join (COURSE, courseId);
	let folderStack = [folderRoot, folderCourse, ...await serverStack (imageInfo)];
	let folderRootFs = path.join (ROOT_FS, boardId);
	if (await mountAufs (folderStack, folderRootFs, ['suid']))
	{
		// export nfs
	}
	else
	{
		console.error ('mount root fs for '+imageInfo.id+':'+courseId+':'+userId+' faliled (unable to mount course file system)')
	}
}

async function unmountRootFs (boardId)
{
	// unexport fs
	let folderRootFs = path.join (ROOT_FS, boardId);
	// umount /proc
	return await unmount (folderRootFs);
}

function exportFs (path, options)
{
	let params = ['*:'+path];
	if (options) params.push ('-o', options.join (','));
	// TODO verify errors
	return spawnPrivileged ('exportfs', params);
}

function unexportFs (path)
{
	// TODO verify errors
	return spawnPrivileged ('exportfs', ['-u', '*:'+path]);
}

async function listExportFs ()
{
	
}

async function run ()
{
	// let imageInfo = await mountImage ('../../../../../Downloads/2018-04-18-raspbian-stretch-lite.img');
	let imageInfo = await mountImage ('../../../../Downloads/2018-06-27-raspbian-stretch-lite.img');
	console.log (imageInfo);
	// await mountPartition (imageInfo, 'fat', 'fat');
	// await mountPartition (imageInfo, 'ext3', 'ext3');
	setupServer (imageInfo);
	// await unmount (imageInfo.bootFolder);
	// await unmount (imageInfo.fsFolder);
}

run ();

module.exports.readImageInfo = readImageInfo;