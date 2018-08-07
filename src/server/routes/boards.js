'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:boards-route');
var db = require('../database/database.js');
var error = require('../error.js');

var boardApp = express.Router();
var remoteApp = express.Router();

debug.log = console.info.bind(console);

boardApp.post('/get_id/:board_serial', async function(res, req, next) {
	var e;
	var board_serial = req.params.board_serial;
	try {
		var board = await db.board.findBySerial(board_serial);
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
	res.status(200).send({ err: 0, board });
});


remoteApp.post('/exchange', async function(req, res, next) {
	var e;
	// var id = req.body.id;
	// var ip = req.body.ip;

	var courseId = req.body.courseId;
	var userId = req.body.userId;

	if (!courseId || !userId) {
		res.status(200).send({ command: 'reboot' });
	}

	try {
		var user = await db.user.findByUserId(userId);
		var course = await db.course.findByStudentId(userId);
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}

	if (!course || !user) {
		res.status(200).send({ command: 'reboot' });
	}

	res.status(200).send({});

});

module.exports.remoteRoute = remoteApp;
module.exports.boardRoute = boardApp;