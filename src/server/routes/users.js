'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:user-routes');
var uuid = require('uuid');
var db = require('../database/database.js');
var error = require('../error.js');
var publicApp = express.Router();
var privateApp = express.Router();

debug.log = console.info.bind(console);

function createToken() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

var tokens = {};

publicApp.post('/login', async function(req, res, next) {
	var e;
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		debug('Searching for ' + username);
		let user = await db.user.findByUsernameAndPassword(username, password);
		if (user) {
			debug('Found user ' + user);
			var token = createToken();
			tokens[token] = user.userId;
			debug('User ' + user.username + ':' + user.userId + ' logged in');

			try {
				var hasHome = await db.workspace.hasHome(user.userId);
			} catch (err) {
				debug(err);
			}
			if (!hasHome) {
				try {
					await db.workspace.createUserHome(user.userId);
				} catch (err) {
					debug(err);
					e = error.serverError(err);
					next(e);
				}
			}

			res.status(200).send({ err: 0, token: token, role: user.role });
			debug(tokens);
		} else {
			e = error.unauthorized('User or password are not correct');
			next(e);
		}
	} else {
		e = error.badRequest('All fields are required');
		next(e);
	}
});

async function security(req, res, next) {
	var e;
	let token = null;
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token && req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {
		token = req.headers.Authorization.split(' ')[1];
	}
	if (!token) {
		token = req.query.token;
	}
	if (!token) {
		token = req.body.token;
	}
	req.token = token;

	let user;
	if (token) {
		debug('got token', token);
		var userId = tokens[token];
		user = await db.user.findByUserId(userId);
	}
	if (user) {
		req.user = user;
		next();
	} else {
		e = error.unauthorized('Please login first');
		next(e);
	}
}

privateApp.post('/edit', async function(req, res, next) {
	var e;
	if (req.body.firstname || req.body.lastName || req.body.email) {
		try {
			await db.user.edit(req.user.userId, req.body.email,
				req.body.firstName, req.body.lastName);
			debug(req.user.userId + 'changed his info');
			res.status(200).send({ err: 0 });
		} catch (err) {
			debug(err.message);
			e = error.serverError(err.message);
			next(e);
		}
	} else {
		e = error.badRequest('At least one field is required');
		next(e);
	}
});

privateApp.get('/', async function(req, res) {
	debug('User: ' + req.user.userId + 'requested /');
	let user = await db.user.findByUserId(req.user.userId);
	res.status(200).send({ err: 0, user });
});

privateApp.post('/password/edit', async function(req, res, next) {
	var e;
	var oldPass = req.body.oldPassword;
	var newPass = req.body.newPassword;
	if (oldPass && newPass) {
		debug('Editing password');
		if (oldPass !== newPass) {
			let data = await db.user.editPassword(req.user.userId, oldPass, newPass);
			if (data.n === 1) {
				debug('User ' + req.user.userId + ' changed his password');
				res.status(200).send({ err: 0 });
			} else {
				debug('User ' + req.user.userId + 'password change fail');
				e = error.badRequest('Wrong Password');
				next(e);
			}
		} else {
			e = error.badRequest('Please do not use the same password');
			next(e);
		}
	} else {
		e = error.badRequest('Wrong input');
		next(e);
	}
});

privateApp.get('/list/:partOfName', async function(req, res, next) {
	if (req.params.partOfName && req.params.partOfName.length >= 3) {
		var userList = await db.user.findUsers(req.params.partOfName);
		res.status(200).send(userList);
	} else {
		var e = error.badRequest('Name is required');
		next(e);
	}
});

privateApp.get('/logout', function(req, res) {
	delete tokens[req.token];
	debug(req.user.userId + ' logged out');
	res.status(200).send({ err: 0 });
});


privateApp.post('/connect', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	var boardId = req.body.boardId;
	var userId = req.user.userId;
	debug('CourseId:', courseId);
	debug('boardId:', boardId);
	if (!courseId || !boardId) {
		e = error.badRequest('Request must contain course ID and board ID');
		next(e);
	}
	try {
		var board = await db.board.findByBoardId(boardId);
		var course = await db.course.findByCourseIdAndStudentId(courseId, userId);
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}
	if (!course) {
		e = error.badRequest('Invalid course or user ID');
		return next(e);
	}
	if (!board) {
		e = error.badRequest('Invalid board ID');
		return next(e);
	}

	if (board.userId && board.userId !== userId) {
		e = error.unauthorized('Board already in use by other user');
		return next(e);
	}

	if (board.courseId && board.courseId !== courseId) {
		e = error.unauthorized('Board is registered for another course');
		return next(e);
	}

	try {
		await db.board.assignCourseAndUser(boardId, userId, courseId);
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

privateApp.post('/disconnect', async function(req, res, next) {
	var e;
	var userId = req.user.userId;
	console.log(userId);
	try {
		var board = await db.board.findByUserId(userId);
		console.log(board);
		var course = await db.course.findByCourseIdAndStudentId(board.courseId, userId);
		console.log(course);
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}
	if (!board) {
		e = error.notAcceptable('User is not connected to a board');
		return next(e);
	}
	if (!course) {
		e = error.notAcceptable('Invalid user or course ID');
		return next(e);
	}

	try {
		var out = await db.board.unsetCourseAndUser(board.boardId);
		debug(out);
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}
	res.status(200).send({ err: 0 });

});


module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;