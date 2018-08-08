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
		return next(e);
	}
	res.status(200).send({ err: 0, board });
});


remoteApp.post('/exchange', async function(req, res /*, next*/ ) {
	// var e;
	// var id = req.body.id;
	// var ip = req.body.ip;

	var boardId = req.body.boardId;

	if (boardId) {
		var courseId = req.body.courseId;
		var userId = req.body.userId;
		var status = req.body.status;

		let board = await db.board.boardStatus(boardId, status);

		if (board) {
			if (board.courseId !== courseId || board.userId !== userId) {
				await db.board.boardStatus(boardId, 'desync');
				res.send({ err: 0, command: 'reboot' });
			} else {
				if (board.command) {
					await db.board.resetComand(boardId);
				}
				res.status(200).send({ command: board.command });
			}
		} else {
			error.sendError(res, error.unauthorized('The board should boot from this server'));
		}
	} else {
		error.sendError(res, error.badRequest('Wrong boardId'));
	}

});

module.exports.remoteRoute = remoteApp;
module.exports.boardRoute = boardApp;