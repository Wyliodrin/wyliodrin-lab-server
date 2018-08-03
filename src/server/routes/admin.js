'use strict';

var express = require('express');
var debug = require('debug')('development:admin-route');
var db = require('../database/database.js');
var error = require('../error.js');

var adminApp = express.Router();

debug.log = console.info.bind(console);


function adminSecurity(req, res, next) {
	var role = req.user.role;
	if (role === 'admin') {
		next();
	} else {
		var err = error.unauthorized('User is not admin');
		next(err);
	}
}

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
adminApp.post('/create_user', async function(req, res, next) {
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
			next(e);
		}
		res.status(200).send({
			err: 0,
			user: user
		});
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

adminApp.post('/delete_user', async function(req, res, next) {
	var e;
	var userId = req.body.userId;
	try {
		await db.user.deleteByUserId(userId);
	} catch (err) {
		debug(err);
		e = error.serverError();
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.get('/list_users', async function(req, res, next) {
	var e;
	try {
		var users = await db.user.listUsers();
	} catch (err) {
		debug('Error listing users');
		e = error.serverError(err);
		next(e);
	}
	res.status(200).send({ err: 0, users });
});

adminApp.post('/update_user', async function(req, res, next) {
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
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.get('/list_courses', async function(req, res, next) {
	var e;
	try {
		var courses = await db.course.listAllCourses();
	} catch (err) {
		debug('Error listing courses');
		e = error.serverError(err);
		next(e);
	}
	res.status(200).send({ err: 0, courses });
});

adminApp.post('/add_student', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;
	try {
		var out = await db.course.addStudent(courseId, studentId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	if (!out) {
		e = error.badRequest();
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/add_teacher', async function(req, res, next) {
	var e;
	var teacherId = req.body.teacherId;
	var courseId = req.body.courseId;
	try {
		var out = await db.course.addTeacher(courseId, teacherId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	if (!out) {
		e = error.badRequest();
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/add_course', async function(req, res, next) {
	var e;
	var students = req.body.students;
	var teachers = req.body.teachers;
	var name = req.body.name;
	try {
		await db.course.createCourse(name, students, teachers);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/remove_student', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;
	try {
		var out = await db.course.deleteStudent(courseId, studentId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	if (out.err) {
		e = error.badRequest('Invalid course or student');
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/remove_teacher', async function(req, res, next) {
	var e;
	var teacherId = req.body.studentId;
	var courseId = req.body.courseId;
	try {
		var out = await db.course.deleteTeacher(courseId, teacherId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	if (out.err) {
		e = error.badRequest('Invalid course or student');
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/remove_course', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	try {
		await db.course.deleteByCourseId(courseId);
	} catch (err) {
		debug(err);
		e = error.serverError();
		next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.get('/get_user/:userId', async function(req, res, next) {
	var e;
	var userId = req.params.userId;
	try {
		var user = await db.user.findByUserId(userId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	res.status(200).send({ err: 0, user });
});

adminApp.get('/get_user_by_id', async function(req, res, next) {
	var e;
	var userId = req.body.userId;
	try {
		var user = await db.user.findByUserId(userId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
	delete user.password;
	res.status(200).send({ err: 0, user });
});

module.exports.adminSecurity = adminSecurity;
module.exports.adminRoute = adminApp;