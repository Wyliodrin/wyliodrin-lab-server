'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:user-routes');
var db = require('../database/database.js');
var error = require('../error.js');
var tokens = require('./redis-tokens.js');
var socket = require('../socket');

var publicApp = express.Router();
var privateApp = express.Router();
var adminApp = express.Router();


// // redis functions for login tokens
// const getAsync = promisify(client.get).bind(client);
// const setAsync = promisify(client.set).bind(client);
// const delAsync = promisify(client.del).bind(client);
// const KEY = 'wyliodrin-lab-server:';

// client.on('error', function(err) {
// 	console.log('Error' + err);
// });

debug.log = console.info.bind(console);

// function createToken() {
// 	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
// }

publicApp.post('/login', async function(req, res, next) {
	var e;
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		req.debug(debug, 'Searching for ' + username);
		let user = await db.user.findByUsernameAndPassword(username, password);
		if (user) {
			req.debug(debug, 'Found user ' + user);
			var token = tokens.createToken();
			await tokens.set(token, user.userId);
			req.debug(debug, 'User ' + user.username + ':' + user.userId + ' logged in');

			try {
				var hasHome = await db.workspace.hasHome(user.userId);
				req.debug(debug, 'Searching for user' + user.username + ' home');
			} catch (err) {
				req.debug(debug, err);
				e = error.serverError(err);
				return next(e);
			}
			if (!hasHome) {
				try {
					req.debug(debug, 'Creating home for user: ' + user.username);
					await db.workspace.createUserHome(user.userId);
				} catch (err) {
					req.debug(debug, err);
					e = error.serverError(err);
					return next(e);
				}
			}

			res.status(200).send({ err: 0, token: token, role: user.role });
		} else {
			req.debug(debug, 'User or password are not correct')
			e = error.unauthorized('User or password are not correct');
			next(e);
		}
	} else {
		req.debug(debug, 'All fields are required')
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
		req.debug(debug, 'got token' + token);
		var userId = await tokens.get(token);
		req.debug(debug, 'searching for user ' + userId);
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
			req.debug(debug, 'Editting user ' + userId);
			await db.user.edit(userId, null, null, email, firstName, lastName);
			res.status(200).send({ err: 0 });
		} catch (err) {
			req.debug(debug, err);
			e = error.serverError(err);
			next(e);
		}
	} else {
		req.debug(debug, 'No fields were provided for edit user: ' + userId);
		e = error.badRequest('At least one field is required');
		next(e);
	}
});

privateApp.get('/info', async function(req, res) {
	var e;
	req.debug(debug, 'User: ' + req.user.userId + 'requested /info');
	req.debug(debug, 'Searching for user: ' + req.user.userId);
	try {
		var user = await db.user.findByUserId(req.user.userId);
	} catch (err) {
		req.debug(debug, 'Got error searching for user: ' + req.user.userId);
		e = error.serverError(err);
		next(e);
	}
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
		if (oldPass !== newPass) {
			req.debug(debug, 'Editing password');
			let data = await db.user.editPassword(req.user.userId, oldPass, newPass);
			if (data.n === 1) {
				req.debug(debug, 'User ' + req.user.userId + ' changed his password');
				res.status(200).send({ err: 0 });
			} else {
				req.debug(debug, 'User ' + req.user.userId + 'password change fail');
				e = error.badRequest('Wrong Password');
				next(e);
			}
		} else {
			req.debug(debug, 'User ' + req.user.userId + 'provided same password');
			e = error.badRequest('Please do not use the same password');
			next(e);
		}
	} else {
		req.debug(debug, 'User ' + req.user.userId + ' didn\'t provide required fields');
		e = error.badRequest('Wrong input');
		next(e);
	}
});


privateApp.get('/logout', async function(req, res) {
	let e;
	req.debug(debug, 'User: ' + req.user.userId + 'requested to log out');
	try {
		req.debug(debug, 'Unassignning course and user: ' + req.user.userId + 'from board');
		await db.board.unassignCourseAndUser(req.user.userId);
	} catch (err) {
		req.debug(debug, 'Something went wrong with unassigning user from board');
		e = error.serverError(err);
		return next(e);
	}
	try {
		req.debug(debug, 'Removing token from redis server for: ' + req.user.userId);
		await tokens.del(req.token);
	} catch (err) {
		req.debug(debug, 'Something went wrong with removing token');
		e = error.serverError(err);
		return next(e);
	}
	socket.emit('user', req.user.userId, 'disconnect');
	res.status(200).send({ err: 0 });
});

privateApp.post('/connect', async function(req, res, next) {
	var e;
	req.debug(debug, 'User :' + req.user.userId + ' accessed the /connect route');
	var courseId = req.body.courseId;
	var boardId = req.body.boardId;
	var userId = req.user.userId;
	if (!courseId || !boardId) {
		req.debug(debug, 'User :' + req.user.userId + ' didn\'t provide course or boardId');
		e = error.badRequest('Request must contain course ID and board ID');
		next(e);
	} else {
		try {
			req.debug(debug, 'Searching board by boardId');
			var board = await db.board.findByBoardId(boardId);
		} catch (err) {
			req.debug(debug, 'Something went wrong while searching for board');
		}
		try {
			req.debug(debug, 'Searching the course of the user');
			var course = await db.course.findByCourseAndUserId(courseId, userId);
		} catch (err) {
			req.debug(debug, 'Something went wrong while searching for the course of the user');
			e = error.serverError(err);
			next(e);
		}
		if (board && course) {
			if (!board.userId || (board.userId === userId)) {

				// if (!board.courseId || (board.courseId === courseId)) {
				try {
					req.debug(debug, 'Assigning course and user to board');
					await db.board.assignCourseAndUser(boardId, userId, courseId);
					res.status(200).send({ err: 0 });
				} catch (err) {
					req.debug(debug, 'Something went wrong while assigning course and user to board');
					e = error.serverError(err);
					next(e);
				}

				// } else {
				// 	e = error.unauthorized('Board assigned to another course');
				// 	next(e);
				// }
			} else {
				req.debug(debug, 'Another user is assigned to board');
				e = error.unauthorized('Board assigned to another user');
				next(e);
			}
		} else {
			req.debug(debug, 'Invalid course or board Id');
			e = error.badRequest('Invalid course or board ID');
			next(e);
		}
	}
});

privateApp.post('/disconnect', async function(req, res, next) {
	req.debug(debug, 'User :' + req.user.userId + ' accessed the /disconnect route');
	var e;
	var userId = req.user.userId;
	try {
		req.debug(debug, 'Finding board by userId :' + req.user.userId);
		var board = await db.board.findByUserId(userId);
	} catch (err) {
		req.debug(debug, 'Something went wrong while searching board by userId' + req.user.userId);
		e = error.serverError(err);
		next(e);
	}
	try {
		req.debug(debug, 'Finding course by courseId and userId');
		var course = await db.course.findByCourseIdAndStudentId(board.courseId, userId);
	} catch (err) {
		req.debug(debug, 'Something went wrong while searching course by courseId and userId');
		e = error.serverError(err);
		next(e);
	}
	if (board) {
		if (course) {
			try {
				req.debug(debug, 'Unsetting course and user from board');
				await db.board.unsetCourseAndUser(board.boardId);
				db.image.unsetupDelay(board.boardId, 20000);
				req.debug(debug, 'Called image unsetup delay');
				res.status(200).send({ err: 0 });
			} catch (err) {
				req.debug(debug, 'Something went wrong while unsetting board or calling unsetup image delay');
				e = error.serverError(err);
				next(e);
			}
		} else {
			req.debug(debug, 'Client provided invalid user or course Id');
			e = error.badRequest('Invalid user or course ID');
			next(e);
		}
	} else {
		req.debug(debug, 'User is not connected to a board');
		e = error.badRequest('User is not connected to a board');
		next(e);
	}
});

adminApp.post('/update', async function(req, res, next) {
	req.debug(debug, 'User :' + req.user.userId + ' accessed the users/update route');
	var e;
	var userId = req.body.userId;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var role = req.body.role;

	try {
		req.debug(debug, 'Editing user: ' + userId);
		await db.user.edit(userId, username, password, email, firstName, lastName, role);
		res.status(200).send({ err: 0 });
	} catch (err) {
		req.debug(debug, 'Something went wrong while editting user. ' + err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.get('/list', async function(req, res, next) {
	req.debug(debug, 'User :' + req.user.userId + ' accessed the users/update route');
	var e;
	try {
		req.debug(debug, 'Listing users');
		var users = await db.user.listUsers();
		for (var user of users) {
			delete user.password;
			delete user.__v;
			delete user._id;
		}
		res.status(200).send({ err: 0, users });
	} catch (err) {
		req.debug(debug, 'Error listing users. ' + err);
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
	req.debug(debug, 'User :' + req.user.userId + ' accessed the users/get/:userId route');
	var e;
	var userId = req.params.userId;
	try {
		req.debug(debug, 'Searching for user by userId');
		var user = await db.user.findByUserId(userId);
	} catch (err) {
		req.debug(debug, 'Error while searching for user.' + err);
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
	req.debug(debug, 'User :' + req.user.userId + ' accessed the users/create route');
	var e;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var role = req.body.role;
	try {
		req.debug(debug, 'Creating new user');
		var user = await db.user.create(username, password, firstName, lastName, email, role);
		try {
			req.debug(debug, 'Creating workspace for user: ' + user.userId);
			await db.workspace.createUserHome(user.userId);
		} catch (err) {
			req.debug(debug, 'Error creating workspace: ' + err);
			e = error.serverError(err);
			return next(e);
		}
		if (user) {
			delete user._id;
			res.status(200).send({ err: 0, user: user });
		}
	} catch (err) {
		if (err.code !== 11000) {
			req.debug(debug, 'Creation failed', { requestId: req.requestId, error: err });
			e = error.serverError();
			next(e);
		} else {
			req.debug(debug, 'Creation failed, user exists', { requestId: req.requestId, error: err });
			e = error.notAcceptable('User already exists');
			next(e);
		}
	}
});

adminApp.post('/delete', async function(req, res, next) {
	req.debug(debug, 'User :' + req.user.userId + ' accessed the users/delete route');
	var e;
	var userId = req.body.userId;
	try {
		let board = await db.findByUserId(userId);
		if (board) {
			await db.board.unsetupDelay(board.boardId);
		}
		await db.workspace.deleteByUserId(userId);
		await db.user.deleteByUserId(userId);
		res.status(200).send({ err: 0 });
	} catch (err) {
		req.debug(debug, err);
		e = error.serverError();
		next(e);
	}
});

module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;