'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:boards-route');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();
var remoteApp = express.Router();
var adminApp = express.Router();

debug.log = console.info.bind(console);

async function userIsValidForCourse(user, courseId) {
	if (user.role === 'admin') {
		return true;
	}
	var course = await db.course.findByCourseAndUserId(courseId, user.userId);
	if (course) {
		return true;
	}
	return false;
}

privateApp.get('/get/:boardId', async function(req, res, next) {
	var e;
	console.log('Aici');
	var boardId = req.params.boardId;
	console.log('Test serial parms', boardId);
	try {
		var board = await db.board.findByBoardId(boardId);
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}
	res.status(200).send({ err: 0, board });
});

privateApp.get('/user', async function(req, res, next) {
	var e;
	console.log('Aici');
	var userId = req.user.userId;
	console.log('Test serial parms', userId);
	try {
		var board = await db.board.findByUserId(userId);
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}
	res.status(200).send({ err: 0, board });
});

privateApp.post('/assign', async function(req, res, next) {
	var e;
	console.log('Aici');
	var userId = req.user.userId;
	var courseId = req.body.courseId;
	var boardId = req.body.boardId;
	console.log('Test serial parms', userId);
	try {
		// TODO verify course
		var board = await db.board.assignCourseAndUser (boardId, userId, courseId);
		if (board && board.userId === userId)
		{
			res.send ({err: 0});
		}
		else
		{
			error.sendError (res, error.unauthorized ('board is already assigned to a user'));
		}
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}
	res.status(200).send({ err: 0, board });
});

privateApp.get('/list/:courseId', async function(req, res, next) {
	var e;
	var courseId = req.params.courseId;
	try {
		var course = await db.course.findByCourseId(courseId);
		if (course) {
			if (userIsValidForCourse(req.user, courseId)) {
				var boards = await db.board.listBoardsByCourseId(courseId);
				if (boards) {
					res.status(200).send({ err: 0, boards });
				} else {
					res.status(200).send({ err: 0, message: 'No boards registered' });
				}
			} else {
				e = error.unauthorized('Not authorized');
				next(e);
			}
		} else {
			e = error.badRequest('Invalid course ID');
			next(e);
		}
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
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
					await db.board.resetCommand(boardId);
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

adminApp.get('/list', async function(req, res, next) {
	var e;
	try {
		var boards = await db.board.listBoards();
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}

	if (boards) {
		res.status(200).send({ err: 0, boards });
	} else {
		res.status(200).send({ err: 0, message: 'No boards' });
	}
});

module.exports.remoteRoutes = remoteApp;
module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;