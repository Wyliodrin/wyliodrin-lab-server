'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:course-routes');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();
var adminApp = express.Router();

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

adminApp.get('/all', async function(req, res, next) {
	var e;
	try {
		var courses = await db.course.listAllCourses();
	} catch (err) {
		debug('Error listing courses');
		e = error.serverError(err);
		return next(e);
	}
	res.status(200).send({ err: 0, courses });
});

adminApp.post('/add', async function(req, res, next) {
	var e;
	var students = req.body.students;
	var teachers = req.body.teachers;
	var name = req.body.name;
	try {
		await db.course.createCourse(name, students, teachers);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		return next(e);
	}
	//TODO: Send back the course 
	res.status(200).send({ err: 0 });
});

adminApp.post('/remove', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	try {
		await db.course.deleteByCourseId(courseId);
	} catch (err) {
		debug(err);
		e = error.serverError();
		return next(e);
	}
	res.status(200).send({ err: 0 });
});

//TODO: Make a /courses/update

adminApp.get('/get/:courseId', async function(req, res, next) {
	var e;
	var courseId = req.params.courseId;
	try {
		var course = await db.course.findByCourseId(courseId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		return next(e);
	}
	if (!course) {
		e = error.badRequest('Course not found');
		return next(e);
	}

	var finalCourse = {};
	var students = [];
	var teachers = [];

	for (var studentId of course.students) {
		var student = await db.user.findByUserId(studentId);
		students.push(student);
	}

	for (var teacherId of course.teachers) {
		var teacher = await db.user.findByUserId(teacherId);
		teachers.push(teacher);
	}
	finalCourse.name = course.name;
	finalCourse.students = students;
	finalCourse.teachers = teachers;
	finalCourse.courseId = courseId;
	res.status(200).send({ err: 0, course: finalCourse });
});

adminApp.post('/teachers/remove', async function(req, res, next) {
	var e;
	var teacherId = req.body.teacherId;
	var courseId = req.body.courseId;
	try {
		var out = await db.course.deleteTeacher(courseId, teacherId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		return next(e);
	}
	if (out.err) {
		e = error.badRequest('Invalid course or student');
		return next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/teachers/add', async function(req, res, next) {
	var e;
	var teacherId = req.body.teacherId;
	var courseId = req.body.courseId;
	try {
		var user = await db.user.findByUserId(courseId);
		if (!user) {
			e = error.badRequest('Invalid teacher ID');
			return next(e);
		}
		var out = await db.course.addTeacher(courseId, teacherId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		return next(e);
	}
	if (!out) {
		e = error.badRequest();
		return next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/students/remove', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;
	try {
		var out = await db.course.deleteStudent(courseId, studentId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		return next(e);
	}
	if (out.err) {
		e = error.badRequest('Invalid course or student');
		return next(e);
	}
	res.status(200).send({ err: 0 });
});

adminApp.post('/students/add', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;

	try {
		var user = await db.user.findByUserId(studentId);
		if (!user) {
			e = error.badRequest('Invalid student ID');
			return next(e);
		}
		var out = await db.course.addStudent(courseId, studentId);
	} catch (err) {
		debug(err);
		e = error.serverError(err);
		return next(e);
	}
	if (!out) {
		e = error.badRequest();
		return next(e);
	}
	res.status(200).send({ err: 0 });
});

module.exports.adminRoutes = adminApp;
module.exports.privateRoutes = privateApp;