'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:projects-routes');
var db = require('../database/database.js');
var error = require('../error.js');
var privateApp = express.Router();

debug.log = console.info.bind(console);

privateApp.post('/add', async function(req, res, next) {
	var e;
	var userId = req.user.userId;
	var projectName = req.body.name;
	var language = req.body.language;
	if (projectName && language) {
		try {
			var result = await db.workspace.createProject(userId, projectName, language);
			if (result.success) {
				res.status(200).send({ err: 0 });
			} else {
				if (result.message === 'Invalid project name') {
					e = error.badRequest(result.message);
				} else {
					e = error.serverError(result.message);
				}
				next(e);
			}
		} catch (err) {
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.badRequest('Please provide all fields');
		next(e);
	}
});

privateApp.get('/list', async function(req, res, next) {
	var e;
	var userId = req.user.userId;
	try {
		var projects = await db.workspace.listProjects(userId);
		res.status(200).send({ err: 0, projects });
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
});

module.exports.privateRoutes = privateApp;