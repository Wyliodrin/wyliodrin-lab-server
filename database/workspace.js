'use strict';

var path = require('path');
var fs = require('fs-extra');
var debug = require('debug')('development:db-workspace');
var user = require('./user.js');
var stream = require('stream');

debug.log = console.info.bind(console);

var HOMES = process.env.USER_HOMES;
var PROJECTS = 'projects';

async function init() {
    if (!fs.existsSync(HOMES)) {

        try {
            await fs.mkdir(HOMES);
        } catch (err) {
            debug('Error creating homes directory. Error:\n', err);
        }
    }
    debug('Homes exists');
}

async function createUserHome(userId) {
    var userHome = path.join(HOMES, userId);
    var userProjects = path.join(userHome, PROJECTS);

    try {
        await fs.mkdir(userHome);
    } catch (err) {
        debug('Error making user home', err);
        throw new Error('File System Error: \n', err);
    }
    try {
        await fs.mkdir(userProjects);
    } catch (err) {
        debug('Error making user project folder', err);
        throw new Error('File System Error: \n', err);
    }
}

async function createProject(userId, projectName) {

    var regex = new RegExp(/^[\w\-. ]+$/);
    if (!regex.test(projectName)) {
        return { success: false, message: 'Invalid project name' };
    }

    var userHome = path.join(HOMES, userId);
    var userProjects = path.join(userHome, PROJECTS);
    var projectName = path.join(userProjects, projectName);

    try {
        await fs.mkdir(projectName);
    } catch (err) {
        debug('Error creating project', err);
        return { success: false, message: 'File System Error: \n' + err };
    }
    return { success: true };
}

/**
 * Save a file from the user
 * @param {String} userId 
 * @param {Object} file - file object containing path, name and content
 */
async function saveFile(file) {

    // TODO: Finnish writing content to project folder
    try {
        await fs.writeFile(file.name, file.content);
    } catch (err) {
        debug(err);
        return { success: false, message: 'File System Error: \n', err };
    }
    return { success: true };

}


/**
 * Lists the projects of a user 
 * @param {String} userId Id of user to list projects
 */
async function listProjects(userId) {
    var userHome = path.join(HOMES, userId)
    var userProjects = path.join(userHome, PROJECTS);
    var projectList = [];

    try {
        var projects = await fs.readdir(userProjects);
    } catch (err) {
        debug(`Error reading project list`);
        throw new Error('File System Error: \n', err);
    }

    projectList.forEach((projectName) => {
        projectList.push({ name: projectName });
    });

    return projectList;
}
init();

var workspace = {
    createUserHome,
    createProject,
    saveFile,
    listProjects
}

module.exports = workspace;