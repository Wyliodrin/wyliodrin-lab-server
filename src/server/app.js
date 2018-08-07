'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var debug = require('debug')('wyliodrin-lab-server:app');
require('./database/database.js');
var users = require('./routes/users');
var error = require('./error.js');
var projects = require('./routes/projects');
var admin = require('./routes/admin');
var boards = require('./routes/boards');
var statusCodes = require('http-status-codes');

debug.log = console.info.bind(console);
var app = express();

if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));

var apiv1 = express.Router();

apiv1.use(bodyParser.urlencoded({ extended: false }));
apiv1.use(bodyParser.json());


apiv1.use('/user', users.publicRoutes);

apiv1.use('/remote', boards.remoteRoute);

apiv1.use(users.security);

apiv1.use('/boards', boards.boardRoute);

apiv1.use('/user', users.privateRoutes);

apiv1.use('/projects', projects.projectsRouter);

apiv1.use(admin.adminSecurity);

apiv1.use('/admin', admin.adminRoute);

app.use('/api/v1', apiv1);

app.use(express.static(path.join(__dirname, '../ui')));

app.get('/', function(req, res) {
	res.redirect('/login.html');
});

app.use(function(err, res) {
	if (err.status) {
		if (err.status == statusCodes.INTERNAL_SERVER_ERROR) {
			error.sendError(res, error.serverError('Something went wrong with your request. Try again later!'));
			console.error(err);
		}
		error.sendError(res, err);
	} else {
		error.sendError(res, error.notFound('Page not found'));
	}
});

module.exports = app;