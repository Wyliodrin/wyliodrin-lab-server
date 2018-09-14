'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:user-routes');
var uuid = require('uuid');
var db = require('../database/database.js');
var error = require('../error.js');
var redis = require('redis');
var { promisify } = require('util');

var publicApp = express.Router();
var privateApp = express.Router();
var adminApp = express.Router();

var client = redis.createClient();

// redis functions for login tokens
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const KEY = 'wyliodrin-lab-server:';

client.on('error', function(err) {
	console.log('Error' + err);
});

debug.log = console.info.bind(console);

function createToken() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

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
			await setAsync(KEY + token, user.userId);
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
					return next(e);
				}
			}

			res.status(200).send({ err: 0, token: token, role: user.role });
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
		var userId = await getAsync(KEY + token);
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
	var userId = req.user.userId;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	if (firstName || lastName || email) {
		try {
			await db.user.edit(userId, null, null, email, firstName, lastName);
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

privateApp.get('/info', async function(req, res) {
	debug('User: ' + req.user.userId + 'requested /');
	let user = await db.user.findByUserId(req.user.userId);
	delete user.password;
	delete user._id;
	delete user.__v;
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


privateApp.get('/logout', async function(req, res) {
	debug(req.user.userId + ' logged out');
	await delAsync(KEY + req.token);

	res.status(200).send({ err: 0 });
});

privateApp.post('/connect', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	var boardId = req.body.boardId;
	var userId = req.user.userId;
	if (!courseId || !boardId) {
		e = error.badRequest('Request must contain course ID and board ID');
		next(e);
	} else {
		try {
			var board = await db.board.findByBoardId(boardId);
			var course = await db.course.findByCourseIdAndStudentId(courseId, userId);
		} catch (err) {
			e = error.serverError(err);
			next(e);
		}
		if (board && course) {
			if (!board.userId || (board.userId === userId)) {

				// if (!board.courseId || (board.courseId === courseId)) {
				try {
					await db.board.assignCourseAndUser(boardId, userId, courseId);
					res.status(200).send({ err: 0 });

				} catch (err) {
					e = error.serverError(err);
					next(e);
				}

				// } else {
				// 	e = error.unauthorized('Board assigned to another course');
				// 	next(e);
				// }
			} else {
				e = error.unauthorized('Board assigned to another user');
				next(e);
			}
		} else {
			e = error.badRequest('Invalid course or board ID');
			next(e);
		}
	}
});

privateApp.post('/disconnect', async function(req, res, next) {
	var e;
	var userId = req.user.userId;
	try {
		var board = await db.board.findByUserId(userId);
		var course = await db.course.findByCourseIdAndStudentId(board.courseId, userId);
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
	if (board) {
		if (course) {
			try {
				await db.board.unsetCourseAndUser(board.boardId);
				db.image.unsetupDelay(board.boardId, 20000);
				res.status(200).send({ err: 0 });
			} catch (err) {
				e = error.serverError(err);
				next(e);
			}
		} else {
			e = error.badRequest('Invalid user or course ID');
			next(e);
		}
	} else {
		e = error.badRequest('User is not connected to a board');
		next(e);
	}
});

adminApp.post('/update', async function(req, res, next) {
	var e;
	var userId = req.body.userId;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var role = req.body.role;

	try {
		await db.user.edit(userId, username, password, email, firstName, lastName, role);
		res.status(200).send({ err: 0 });
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.get('/list', async function(req, res, next) {
	var e;
	try {
		var users = await db.user.listUsers();
		for (var user of users) {
			delete user.password;
			delete user.__v;
			delete user._id;
		}
		res.status(200).send({ err: 0, users });
	} catch (err) {
		debug('Error listing users');
		e = error.serverError(err);
		next(e);
	}
});

// adminApp.get('/find/:partOfName', async function(req, res, next) {
// 	if (req.params.partOfName && req.params.partOfName.length >= 3) {
// 		var userList = await db.user.findUsers(req.params.partOfName);
// 		res.status(200).send(userList);
// 	} else {
// 		var e = error.badRequest('Name is required');
// 		next(e);
// 	}
// });

adminApp.get('/get/:userId', async function(req, res, next) {
	var e;
	var userId = req.params.userId;
	try {
		var user = await db.user.findByUserId(userId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	if (user) {
		delete user.password;
		delete user.__v;
		delete user._id;
		res.status(200).send({ err: 0, user });
	} else {
		res.status(200).send({ err: 0, message: 'User not found' });
	}
});

/**
 * @api {post} /create Create a user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiParam {String} firstName First name of user
 * @apiParam {String} email Email of user
 *
 * @apiSuccess {Number} err 0 
 * @apiError {String} err Error
 * @apiError {String} statusError error
 */
adminApp.post('/create', async function(req, res, next) {
	var e;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var role = req.body.role;
	try {
		var user = await db.user.create(username, password, firstName, lastName, email, role);
		try {
			await db.workspace.createUserHome(user.userId);
		} catch (err) {
			debug('Error creating workspace', err);
			e = error.serverError(err);
			return next(e);
		}
		if (user) {
			delete user._id;
			res.status(200).send({
				err: 0,
				user: user
			});

		}
	} catch (err) {
		if (err.code !== 11000) {
			debug('Creation failed', { requestId: req.requestId, error: err });
			e = error.serverError();
			next(e);
		} else {
			debug('Creation failed, user exists', { requestId: req.requestId, error: err });
			e = error.notAcceptable('User already exists');
			next(e);
		}
	}
});

adminApp.post('/delete', async function(req, res, next) {
	var e;
	var userId = req.body.userId;
	try {
		await db.user.deleteByUserId(userId);
		res.status(200).send({ err: 0 });
	} catch (err) {
		debug(err);
		e = error.serverError();
		next(e);
	}
});

module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;