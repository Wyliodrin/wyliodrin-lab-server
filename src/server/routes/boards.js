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


async function userCanDisconnectBoard(board, req, next) {
	var e;
	req.debug(debug, 'Check if user can disconnect board');
	if (req.user.role === 'admin') {
		return true;
	}
	try {
		// It is guaranteed that board contains courseId
		req.debug(debug, 'Finding course by Id');
		var course = await db.course.findByCourseId(board.courseId);
		if (course.teachers.indexOf(req.user.userId) > -1) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		req.debug(debug, 'Error finding course');
		e = error.serverError(err);
		next(e);
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
		req.debug(debug, 'Finding board by userId');
		var board = await db.board.findByUserId(userId);
		res.status(200).send({ err: 0, board });
	} catch (err) {
		req.debug(debug, 'Error finding board by userId');
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
			req.debug(debug, 'Finding board by board Id');
			var board = await db.board.findByBoardId(boardId);
		} catch (err) {
			req.debug(debug, 'Error finding board by board Id' + err);
			e = error.serverError(err);
			return next(e);
		}
		if (board) {
			try {
				req.debug(debug, 'Finding course');
				var course = await db.course.findByCourseId(board.courseId);
			} catch (err) {
				req.debug(debug, 'Error finding course' + err);
				e = error.serverError(err);
				return next(e);
			}
			if (userCanCommandBoard(req.user, course, board)) {
				req.debug(debug, 'User can command board');
				req.debug(debug, 'Socket emits board command');
				socket.emit('board', boardId, 'send', 'p', { c: command });
				res.status(200).send({ err: 0 });
			} else {
				req.debug(debug, 'User cannot reboot board');
				e = error.unauthorized('User cannot reboot board');
				next(e);
			}
		} else {
			e = error.badRequest('Invalid board ID');
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
		req.debug(debug, 'Deleting board by id');
		await db.board.deleteByBoardId(boardId);
		res.status(200).send({ err: 0 });
	} catch (err) {
		req.debug(debug, 'Error deleting board by id' + err);
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
			req.debug(debug, 'Finding board by board ID');
			var board = await db.board.findByBoardId(boardId);
		} catch (err) {
			req.debug(debug, 'Error finding board' + err);
			e = error.serverError(err);
			return next(e);
		}
		if (board) {
			try {
				var course = await db.course.findByCourseAndUserId(courseId, userId);
			} catch (err) {
				req.debug(debug, 'Error finding course' + err);
				e = error.serverError(err);
				return next(e);
			}
			if (course) {
				try {
					req.debug(debug, 'Assigning course and user');
					var boardOut = await db.board.assignCourseAndUser(boardId, userId, courseId);
				} catch (err) {
					req.debug(debug, 'Error assigning course and user' + err);
					e = error.serverError(err);
					return next(e);
				}
				if (boardOut && (boardOut.userId === userId)) {
					res.status(200).send({ err: 0, boardOut });
				} else {
					req.debug(debug, 'Board assigned to another user');
					e = error.unauthorized('Board is already assigned to a user');
					next(e);
				}
			} else {
				req.debug(debug, 'Invalid course or user Id');
				e = error.badRequest('Invalid course or user ID');
				next(e);
			}
		} else {
			req.debug(debug, 'Invalid board Id');
			e = error.badRequest('Invalid board ID');
			next(e);
		}
	} else {
		req.debug(debug, 'User didn\'t privide all required fields');
		e = error.badRequest('Please provide all required fields');
		next(e);
	}
});

privateApp.get('/list/:courseId', async function(req, res, next) {
	var e;
	var courseId = req.params.courseId;
	try {
		req.debug(debug, 'Find course by course Id');
		var course = await db.course.findByCourseId(courseId);
	} catch (err) {
		req.debug(debug, 'Error finding course by ID' + err);
		e = error.serverError(err);
		return next(e);
	}
	if (course) {
		req.debug(debug, 'Check if user is valid for course');
		if (userIsValidForCourse(req.user, course)) {
			try {
				req.debug(debug, 'Listing boards by courseId');
				var boards = await db.board.listBoardsByCourseId(courseId);
			} catch (err) {
				req.debug(debug, 'Error listing boards by course ID' + err);
				e = error.serverError(err);
				return next(e);
			}
			res.status(200).send({ err: 0, boards });
		} else {
			req.debug(debug, 'Not authorized');
			e = error.unauthorized('Not authorized');
			next(e);
		}
	} else {
		req.debug(debug, 'Invalid course ID');
		e = error.badRequest('Invalid course ID');
		next(e);
	}
});

privateApp.post('/disconnect', async function(req, res, next) {
	var e;
	var boardId = req.body.boardId;

	try {
		req.debug(debug, 'Finding board by board ID');
		var board = await db.board.findByBoardId(boardId);
	} catch (err) {
		req.debug(debug, 'Error finding board by board ID' + err);
		e = error.serverError(err);
		return next(e);
	}
	if (board) {
		if (board.courseId && board.userId) {
			req.debug(debug, 'Check user can disconnect board');
			if (await userCanDisconnectBoard(board, req, next)) {
				try {
					req.debug(debug, 'Unsetting course and user');
					await db.board.unsetCourseAndUser(boardId);
				} catch (err) {
					req.debug(debug, 'Error unsetting course and user' + err);
					e = error.serverError(err);
					return next(e);
				}
				req.debug(debug, 'Unsetup Image delay');
				db.image.unsetupDelay(board.boardId, 20000);
				req.debug(debug, 'Socket emit reboot and disconnect');
				socket.emit('board', boardId, 'send', 'p', { c: 'reboot' });
				socket.emit('board', boardId, 'disconnect');
				res.status(200).send({ err: 0 });
			} else {
				e = error.unauthorized('User cannot disconnect board');
				next(e);
			}
		} else {
			req.debug(debug, 'Board doesn\'t have course and user');
			res.status(200).send({ err: 0 });
		}
	} else {
		req.debug(debug, 'Invalid boardId');
		e = error.badRequest('Invalid boardId');
		next(e);
	}
});


adminApp.get('/list', async function(req, res, next) {
	var e;
	try {
		req.debug(debug, 'Listing boards');
		var boards = await db.board.listBoards();
	} catch (err) {
		req.debug(debug, 'Error listing boards' + err);
		e = error.serverError(err);
		return next(e);
	}

	if (boards) {
		req.debug(debug, 'Sending boards');
		res.status(200).send({ err: 0, boards });
	} else {
		req.debug(debug, 'No boards');
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