'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:course-routes');
var db = require('../database/database.js');
var error = require('../error.js');

var publicApp = express.Router();
var privateApp = express.Router();
var adminApp = express.Router();

async function userCanAddStudents(user, courseId) {
	if (user.role === 'admin') {
		return true;
	}
	var course = await db.course.findByCourseIdAndTeacher(courseId, user.userId);
	if (course) {
		return true;
	}
	return false;
}

publicApp.get('/public', async function(req, res, next) {
	var e;
	try {
		var courses = await db.course.listPublicCourses();
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		debug('Error listing courses');
		e = error.serverError(err);
		next(e);
	}
});

privateApp.get('/', async function(req, res, next) {
	var e;
	var userId = req.user.userId;

	try {
		var courses = await db.course.findByStudentId(userId);
	} catch (err) {
		e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0, courses });
});

privateApp.post('/students/remove', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;

	if (userCanAddStudents(req.user, courseId)) {
		try {
			var students = await db.user.findOneOrMoreByUserId(studentId);
			if (!students) {
				e = error.badRequest('Invalid student ID');
				next(e);
			} else {
				var studentIds = [];
				for (var student of students) {
					studentIds.push(student.userId);
				}
				await db.course.deleteStudents(courseId, studentIds);
				res.status(200).send({ err: 0 });
			}
		} catch (err) {
			debug(err);
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.unauthorized('User cannot add students');
		next(e);
	}

});

privateApp.post('/students/add', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;

	if (userCanAddStudents(req.user, courseId)) {
		try {
			var students = await db.user.findOneOrMoreByUserId(studentId);
			if (!students) {
				e = error.badRequest('Invalid student ID');
				next(e);
			} else {
				var studentIds = [];
				for (var student of students) {
					studentIds.push(student.userId);
				}
				await db.course.addStudents(courseId, studentIds);
				res.status(200).send({ err: 0 });
			}
		} catch (err) {
			debug(err);
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.unauthorized('User cannot add students');
		next(e);
	}

});

adminApp.get('/all', async function(req, res, next) {
	var e;
	try {
		var courses = await db.course.listAllCourses();
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		debug('Error listing courses');
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/add', async function(req, res, next) {
	var e;
	var students = req.body.students;
	var teachers = req.body.teachers;
	var name = req.body.name;
	try {
		var course = await db.course.createCourse(name, students, teachers);
		if (course) {
			res.status(200).send({ err: 0, course });
		} else {
			e = error.badRequest('User or user field already in use');
			next(e);
		}
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/remove', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	try {
		await db.course.deleteByCourseId(courseId);
		res.status(200).send({ err: 0 });
	} catch (err) {
		debug(err);
		e = error.serverError();
		next(e);
	}
});

adminApp.post('/update', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	var name = req.body.name;
	if (courseId && name) {
		try {
			await db.course.editCourse(courseId, name);
			res.status(200).send({ err: 0 });
		} catch (err) {
			debug(err.message);
			e = error.serverError(err.message);
			next(e);
		}
	} else {
		e = error.badRequest('New name for the course is required');
		next(e);
	}
});

adminApp.get('/get/:courseId', async function(req, res, next) {
	var e;
	var courseId = req.params.courseId;
	try {
		var course = await db.course.findByCourseId(courseId);
		if (course) {
			res.status(200).send({ err: 0, course });
		} else {
			e = error.badRequest('Course not found');
			next(e);
		}
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/teachers/remove', async function(req, res, next) {
	var e;
	var teacherId = req.body.teacherId;
	var courseId = req.body.courseId;
	try {
		var out = await db.course.deleteTeachers(courseId, teacherId);
		if (out.err) {
			e = error.badRequest('Invalid course or student');
			next(e);
		} else {
			res.status(200).send({ err: 0 });
		}
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/teachers/add', async function(req, res, next) {
	var e;
	var teacherId = req.body.teacherId;
	var courseId = req.body.courseId;
	try {
		var user = await db.user.findByUserId(teacherId);
		if (user) {
			await db.course.addTeacher(courseId, teacherId);
			res.status(200).send({ err: 0 });
		} else {
			e = error.badRequest('Invalid user Id');
			next(e);
		}
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
});

module.exports.publicRoutes = publicApp;
module.exports.adminRoutes = adminApp;
module.exports.privateRoutes = privateApp;