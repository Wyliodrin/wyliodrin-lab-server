'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:boards-route');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();
var remoteApp = express.Router();
var adminApp = express.Router();
var socket = require('../socket');

debug.log = console.info.bind(console);

function userIsValidForCourse(user, course) {
	if (user.role === 'admin') {
		return true;
	}
	if ((course.students.indexOf(user.userId) > -1) || (course.teachers.indexOf(user.userId) > -1)) {
		return true;
	} else {
		return false;
	}
}

function userCanCommandBoard(user, course, board) {
	if (user.role === 'admin') {
		return true;
	}
	if (user.userId === board.userId) {
		return true;
	}
	if (course && (course.teachers.indexOf(user.userId) > -1) && (board.courseId === course.courseId)) {
		return true;
	}

	return false;
}


async function userCanDisconnectBoard(board, user) {
	if (user.role === 'admin') {
		return true;
	}
	try {
		// It is guaranteed that board contains courseId
		var course = await db.course.findByCourseId(board.courseId);
		if (course.teachers.indexOf(user.userId) > -1) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		throw new Error('MongoDB error', err);
	}
}

// remoteApp.post('/exchange', async function(req, res /*, next*/ ) {
// 	// var e;
// 	// var id = req.body.id;
// 	// var ip = req.body.ip;

// 	var boardId = req.body.boardId;

// 	if (boardId) {
// 		var courseId = req.body.courseId;
// 		var userId = req.body.userId;
// 		var status = req.body.status;
// 		var ip = req.body.ip;

// 		let board = await db.board.boardStatus(boardId, status, ip);

// 		if (status === 'reboot' || status === 'poweroff') db.image.unsetupDelay (boardId);

// 		if (board) {
// 			console.log (req.body);
// 			console.log (board);
// 			if (board.courseId !== courseId || board.userId !== userId) {
// 				await db.board.boardStatus(boardId, 'desync');
// 				res.send({ err: 0, command: 'reboot' });
// 			} else {
// 				if (board.command) {
// 					await db.board.resetCommand(boardId);
// 				}
// 				res.status(200).send({ err: 0, command: board.command });
// 			}
// 		} else {
// 			error.sendError(res, error.unauthorized('The board should boot from this server'));
// 		}
// 	} else {
// 		error.sendError(res, error.badRequest('Wrong boardId'));
// 	}

// });

privateApp.get('/get/:boardId', async function(req, res, next) {
	var e;
	var boardId = req.params.boardId;
	try {
		req.debug(debug, 'Finding board');
		var board = await db.board.findByBoardId(boardId);
		if (board) {
			delete board.__v;
			delete board._id;
			res.status(200).send({ err: 0, board });
		} else {
			req.debug(debug, 'Invalid boardId');
			e = error.badRequest('Invalid boardId');
			next(e);
		}
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
});

privateApp.get('/user', async function(req, res, next) {
	var e;
	var userId = req.user.userId;
	try {
		req.debug(debug, 'Finding board ')
		var board = await db.board.findByUserId(userId);
		res.status(200).send({ err: 0, board });
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
});

privateApp.post('/command', async function(req, res, next) {
	var e;
	var boardId = req.body.boardId;
	var command = req.body.command;
	if (boardId) {
		try {
			var board = await db.board.findByBoardId(boardId);
			if (board) {
				var course = await db.course.findByCourseId(board.courseId);
				if (userCanCommandBoard(req.user, course, board)) {
					socket.emit('board', boardId, 'send', 'p', { c: command });
					res.status(200).send({ err: 0 });
				} else {
					e = error.unauthorized('User cannot reboot board');
					next(e);
				}
			} else {
				e = error.badRequest('Invalid board ID');
				next(e);
			}
		} catch (err) {
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.badRequest('One or more fields missing');
		next(e);
	}
});

adminApp.post('/remove', async function(req, res, next) {
	var e;
	var boardId = req.body.boardId;

	try {
		await db.board.deleteByBoardId(boardId);
		res.status(200).send({ err: 0 });
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}

});

adminApp.post('/assign', async function(req, res, next) {
	var e;
	var userId = req.body.userId;
	var courseId = req.body.courseId;
	var boardId = req.body.boardId;
	if (courseId && boardId && userId) {
		try {
			var board = await db.board.findByBoardId(boardId);
			if (board) {
				var course = await db.course.findByCourseAndUserId(courseId, userId);
				if (course) {
					var boardOut = await db.board.assignCourseAndUser(boardId, userId, courseId);
					if (boardOut && (boardOut.userId === userId)) {
						res.status(200).send({ err: 0, boardOut });
					} else {
						e = error.unauthorized('Board is already assigned to a user');
						next(e);
					}
				} else {
					e = error.badRequest('Invalid course or user ID');
					next(e);
				}
			} else {
				e = error.badRequest('Invalid board ID');
				next(e);
			}
		} catch (err) {
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.badRequest('Please provide all required fields');
		next(e);
	}
});

privateApp.get('/list/:courseId', async function(req, res, next) {
	var e;
	var courseId = req.params.courseId;
	try {
		var course = await db.course.findByCourseId(courseId);
		if (course) {
			if (userIsValidForCourse(req.user, course)) {
				var boards = await db.board.listBoardsByCourseId(courseId);
				res.status(200).send({ err: 0, boards });
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

privateApp.post('/disconnect', async function(req, res, next) {
	var e;
	var boardId = req.body.boardId;

	try {
		var board = await db.board.findByBoardId(boardId);
		if (board) {
			if (board.courseId && board.userId) {
				if (await userCanDisconnectBoard(board, req.user)) {
					await db.board.unsetCourseAndUser(boardId);
					db.image.unsetupDelay(board.boardId, 20000);
					socket.emit('board', boardId, 'send', 'p', { c: 'reboot' });
					socket.emit('board', boardId, 'disconnect');
					res.status(200).send({ err: 0 });
				} else {
					e = error.unauthorized('User cannot disconnect board');
					next(e);
				}
			} else {
				res.status(200).send({ err: 0 });
			}
		} else {
			e = error.badRequest('Invalid boardId');
			next(e);
		}
	} catch (err) {
		e = error.serverError(err);
		next(e);
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

// adminApp.post('/disconnect', async function(req, res, next) {
// 	var e;
// 	var boardId = req.body.boardId;
// 	try {
// 		await db.board.unsetCourseAndUser(boardId);
// 		res.status(200).send({ err: 0 });
// 	} catch (err) {
// 		e = error.serverError(err);
// 		next(e);
// 	}
// });

module.exports.remoteRoutes = remoteApp;
module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;