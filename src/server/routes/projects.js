'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:projects-routes');
var db = require('../database/database.js');
var error = require('../error.js');
var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/add', async(req, res, next) => {
	var userId = req.user.userId;
	var projectName = req.body.name;
	var language = req.body.language;
	var result = await db.workspace.createProject(userId, projectName, language);
	if (result.success) {
		res.status(200).send({err: 0});
	} else {
		debug(result.message);
		var e = error.serverError();
		next(e);
	}
});

privateApp.get('/list', async(req, res, next) => {
	var userId = req.user.userId;
	try {
		var projects = await db.workspace.listProjects(userId);
	} catch (err) {
		debug('Error router list projects', err);
		var e = error.serverError(err);
		return next(e);
	}
	res.status(200).send({err: 0, projects});
});

module.exports.privateRoutes = privateApp;