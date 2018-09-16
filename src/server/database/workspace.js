'use strict';

var path = require('path');
var fs = require('fs-extra');
var debug = require('debug')('wyliodrin-lab-server:workspace-database');
var statusCodes = require('http-status-codes');
var raspberrypi = require('./raspberrypi');

debug.log = console.info.bind(console);

var PROJECTS = 'projects';

/**
 * 
 * @param {String} filePath - path relative to project for file
 * @param {String} userId - id of the user
 * @param {String} project - the project containing the file
 */
async function verifyPath(filePath, userId, project) {
	var homeFolder = await raspberrypi.pathUser(userId);
	var absPath = path.join(homeFolder, PROJECTS, project, filePath);
	var normalizedPath = path.normalize(absPath);
	var verifyPath = path.join(homeFolder, PROJECTS, project);
	if (normalizedPath.startsWith(verifyPath)) {
		return { valid: true, absPath: absPath, normalizedPath: normalizedPath };
	}
	return { valid: false, absPath: absPath, normalizedPath: normalizedPath };
}

async function hasHome(userId) {
	var userHome = await raspberrypi.pathUser(userId);
	try {
		var homeExists = await fs.pathExists(userHome);
	} catch (err) {
		throw new Error('Got error checking home', err);
	}
	return homeExists;
}

async function projectExists(userId, project) {
	var userHome = await raspberrypi.pathUser(userId);
	var projPath = path.join(userHome, PROJECTS, project);

	try {
		var exists = await fs.pathExists(projPath);
	} catch (err) {
		throw new Error('Got error checking project', err);
	}

	return exists;
}

async function fileExists(userId, project, filePath) {
	var userHome = await raspberrypi.pathUser(userId);
	var file_path = path.join(userHome, PROJECTS, project, filePath);
	try {
		var exists = await fs.pathExists(file_path);
	} catch (err) {
		throw new Error('Got error checking project', err);
	}

	return exists;
}



async function createUserHome(userId) {
	var userHome = await raspberrypi.pathUser(userId, true);
	var userProjects = path.join(userHome, PROJECTS);

	// try {
	// 	await fs.mkdir(userHome);
	// } catch (err) {
	// 	debug('Error making user home', err);
	// 	throw new Error('File System Error: \n', err);
	// }
	try {
		await fs.mkdir(userProjects);
	} catch (err) {
		debug('Error making user project folder', err);
		throw new Error('File System Error', err);
	}
}

function isValidName(name) {
	var regex = new RegExp(/^[\w\-. ]+$/);
	if (regex.test(name) && name !== '.' && name !== '..') {
		return true;
	}
	return false;

}

async function createProject(userId, projectName, language) {

	if (!isValidName(projectName)) {
		return { success: false, message: 'Invalid project name' };
	}
	var userHome = await raspberrypi.pathUser(userId);
	var userProjects = path.join(userHome, PROJECTS);
	var projectPath = path.join(userProjects, projectName);
	var propertiesFile = path.join(projectPath, 'wylioproject.json');

	let mainFile = null;
	if (language === 'python') mainFile = path.join(projectPath, 'main.py');
	else
	if (language === 'visual') mainFile = path.join(projectPath, 'main.visual');

	try {
		debug(projectPath);
		await fs.ensureDir(projectPath);
		await fs.writeFile(propertiesFile, JSON.stringify({
			language: language
		}));
		// TODO use templates
		if (mainFile !== null) {
			await fs.writeFile(mainFile, '');
		}
		debug('Project created');
		return { success: true };
	} catch (err) {
		debug('Error creating project', err);
		return { success: false, message: 'File System Error', err };
	}
}


/**
 * 
 * @param {String} filePath - the file path relative to the project
 * @param {String} userId - id of the user
 * @param {String} project - name of the project 
 * @param {Object} data - object containing name of file and data from file 
 */
async function setFile(filePath, userId, project, data) {
	try {
		var projExists = await projectExists(userId, project);
	} catch (err) {
		return { success: false, message: 'File System Error' + err, err: statusCodes.INTERNAL_SERVER_ERROR };
	}

	if (!projExists) {
		return { success: false, message: 'Project not found', err: statusCodes.BAD_REQUEST };
	}

	var pathIsValid = await verifyPath(filePath, userId, project);
	if (!pathIsValid.valid) {
		return { success: false, message: 'Invalid path', err: statusCodes.BAD_REQUEST };
	}

	var fileData = new Buffer(data, 'base64');
	var normalized_path = pathIsValid.normalizedPath;
	try {
		await fs.outputFile(normalized_path, fileData);
	} catch (err) {
		debug('Got error writing file: ', err);
		return { success: false, message: 'File system error' + err, err: statusCodes.INTERNAL_SERVER_ERROR };
	}

	return { success: true, err: 0 };
}

/**
 * 
 * @param {String} filePath - the file path relative to the project
 * @param {String} userId - id of the user
 * @param {String} project - name of the project 
 */
async function getFile(filePath, userId, project) {
	var pathIsValid = await verifyPath(filePath, userId, project);
	if (!pathIsValid.valid) {
		return { success: false, message: 'Invalid path', err: statusCodes.BAD_REQUEST };
	}
	try {
		var prExists = await projectExists(userId, project);
	} catch (err) {
		debug(err);
		return { success: false, message: 'File system error', err: statusCodes.INTERNAL_SERVER_ERROR };
	}
	if (!prExists) {
		return { success: false, message: 'Project not found', err: statusCodes.BAD_REQUEST };
	}

	try {
		var exists = await fileExists(userId, project, filePath);
	} catch (err) {
		debug(err);
		return { success: false, message: 'File system error', err: statusCodes.INTERNAL_SERVER_ERROR };
	}
	if (!exists) {
		return { success: false, message: 'File not found', err: statusCodes.BAD_REQUEST };
	}

	var normalized_path = pathIsValid.normalizedPath;

	try {
		var data = (await fs.readFile(normalized_path)).toString('base64');
	} catch (err) {
		debug(err);
		return { success: false, message: 'File system error', err: statusCodes.INTERNAL_SERVER_ERROR };
	}

	return { success: true, data, err: 0 };
}

/**
 * 
 * @param {String} filePath - the file path relative to the project
 * @param {String} userId - id of the user
 * @param {String} project - name of the project 
 */
async function getFolder(userId, project, folder) {
	var pathIsValid = await verifyPath(folder, userId, project);
	if (!pathIsValid.valid) {
		return { success: false, message: 'Invalid path', err: statusCodes.BAD_REQUEST };
	}
	try {
		var prExists = await projectExists(userId, project);
	} catch (err) {
		console.log(err);
		return { success: false, message: 'File system error', err: statusCodes.INTERNAL_SERVER_ERROR };
	}
	if (!prExists) {
		return { success: false, message: 'Project not found', err: statusCodes.BAD_REQUEST };
	}

	var normalized_path = pathIsValid.normalizedPath;

	var data = [];
	try {
		var files = (await fs.readdir(normalized_path));
		for (let file of files)
		{
			if (file !== '.' && file !== '..')
			{
				let stat = await fs.stat (path.join (normalized_path, file));
				let f = {
					name: file
				};
				if (stat.isDirectory ()) 
				{
					f.type = 'dir';
					f.contents = await getFolder (userId, project, path.join (folder, file));
				}
				if (stat.isFile()) f.type = 'file';
				data.push (f);
			}
		}
	} catch (err) {
		console.log(err);
		return { success: false, message: 'File system error', err: statusCodes.INTERNAL_SERVER_ERROR };
	}

	return { success: true, data, err: 0 };
}


/**
 * Lists the projects of a user 
 * @param {String} userId Id of user to list projects
 */
async function listProjects(userId) {
	var userHome = await raspberrypi.pathUser(userId);
	var userProjects = path.join(userHome, PROJECTS);
	debug(userProjects);
	var projectList = [];

	try {
		var projects = await fs.readdir(userProjects);
	} catch (err) {
		debug('Error reading project list');
		throw new Error('File System Error: \n', err);
	}

	projects.forEach((projectName) => {
		projectList.push({ name: projectName });
	});
	debug('Projects: ', projectList);

	return projectList;
}

var workspace = {
	createUserHome,
	createProject,
	listProjects,
	hasHome,
	setFile,
	getFile,
	getFolder
};

module.exports = workspace;