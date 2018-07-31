'use strict';

var express = require('express');
var fs = require('fs-extra');
var debug = require('debug')('development:projects');
var db = require('../database/database.js');
var error = require('../error.js');

var projectApp = express.Router();

projectApp.post('/new_project', function(req, res) {
    var projectName = req.body.project;

})