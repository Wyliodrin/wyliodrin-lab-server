'use strict';

var express = require('express');
var fs = require('fs-extra');
var debug = require('debug')('development:projects');
var db = require('../database/database.js');
var error = require('../error.js');

var projectApp = express.Router();

projectApp.post('/new_project', async(res, req, next) => {
    var userId = req.user.userId;
    var projectName = req.body.projectName;
    var result = await db.workspace.createProject(userId, projectName);
    if (result.success) {
        res.status(200).send({});
    } else {
        next(err);
    }

});

projectApp.post('/list_projects', async(req, res, next) => {
    var userId = req.user.userId;
    try {
        var projects = await db.workspace.listProjects(userId);
    } catch (err) {
        debug('Error router list projects', err);
        next(err);
    }
    res.status(200).send(projects);
});

projectApp.use(function internalError(err, req, res, next) {
    error.sendError(res, error.serverError());
});

module.exports.projectsRouter = projectApp;