'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:boards-route');
var db = require('../database/database.js');
var error = require('../error.js');

var boardApp = express.Router();

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