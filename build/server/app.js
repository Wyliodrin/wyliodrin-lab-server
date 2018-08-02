'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var statusCodes = require('http-status-codes');
require('./database/database.js');
var users = require('./routes/users');
var error = require('./error.js');
var projects = require('./routes/projects');

var app = express();

if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));

var apiv1 = express.Router();

apiv1.use(bodyParser.urlencoded({ extended: false }));
apiv1.use(bodyParser.json());

apiv1.use('/user', users.publicRoutes);

apiv1.use(users.security);

apiv1.use('/user', users.privateRoutes);

apiv1.use('/projects', projects.projectsRouter);

app.use('/api/v1', apiv1);

app.use(express.static(path.join(__dirname, '../ui')));

app.get('/', function(req, res) {
    res.redirect('/views/login.html');
});

app.use(function errorMiddleware(err, req, res, next) {
    if (err.status) {
        error.sendError(res, err);
    } else {
        error.sendError(res, error.notFound('Page not found'));
    }
});

module.exports = app;