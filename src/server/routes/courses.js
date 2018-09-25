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
		for (var course of courses) {
			delete course._id;
		}
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		req.debug(debug,'Error listing courses');
		e = error.serverError(err);
		next(e);
	}
});

privateApp.get('/', async function(req, res, next) {
	var e;
	var userId = req.user.userId;

	try {
		var courses = await db.course.findByUserId(userId);
		for (var course of courses) {
			delete course.__v;
			delete course._id;
		}
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}

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
				await db.board.deleteUsersFromBoards(studentIds);
				res.status(200).send({ err: 0 });
			}
		} catch (err) {
			req.debug(debug,err);
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.unauthorized('User cannot add students');
		next(e);
	}

});

privateApp.post('/image', async function(req, res, next) {
	var e;
	var imageId = req.body.imageId;
	var courseId = req.body.courseId;

	if (userCanAddStudents(req.user, courseId)) {
		try {
			if (db.image.existsImageId(imageId)) {
				// await db.image.removeSetupCourse(courseId);
				await db.course.editCourse(courseId, null, imageId);
				res.send ({err:0});
			}
		} catch (err) {
			req.debug(debug,err);
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.unauthorized('User cannot chnage image');
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
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.unauthorized('User cannot add students');
		next(e);
	}

});

adminApp.get('/image/:imageId', async function(req, res, next) {
	var e;
	var imageId = req.params.imageId;
	try {
		var courses = await db.course.findByImageId(imageId);
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
});


adminApp.get('/all', async function(req, res, next) {
	var e;
	try {
		var courses = await db.course.listAllCourses();
		for (var course of courses) {
			delete course.__v;
			delete course._id;
		}
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		req.debug(debug,'Error listing courses');
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/add', async function(req, res, next) {
	var e;
	var students = req.body.students;
	var teachers = req.body.teachers;
	var name = req.body.name;
	var imageId = req.body.imageId;
	if (!imageId) imageId = db.image.defaultImageId();
	console.log(imageId);
	try {
		var course = await db.course.createCourse(name, students, teachers, imageId);
		if (course) {
			res.status(200).send({ err: 0, course });
		} else {
			e = error.badRequest('One or more invalid fields');
			next(e);
		}
	} catch (err) {
		req.debug(debug,err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/remove', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	try {
		var boards = await db.board.listBoardsByCourseId(courseId);
		if (boards && boards.length === 0) {
			await db.course.deleteByCourseId(courseId);
			await db.image.removeSetupUserCourse (courseId);
			await db.image.removeSetupCourse (courseId);
			res.status(200).send({ err: 0 });
		} else {
			e = error.unauthorized('Please disconnect all boards from course');
			next(e);
		}
	} catch (err) {
		req.debug(debug,err);
		e = error.serverError();
		next(e);
	}
});

adminApp.post('/update', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	var name = req.body.name;
	var imageId = req.body.imageId;
	if (courseId && name) {
		try {
			await db.course.editCourse(courseId, name, imageId);
			res.status(200).send({ err: 0 });
		} catch (err) {
			req.debug(debug,err.message);
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
		req.debug(debug,err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/teachers/remove', async function(req, res, next) {
	var e;
	var teacherId = req.body.teacherId;
	var courseId = req.body.courseId;
	if (teacherId && courseId) {
		try {
			var course = await db.course.findByCourseId(courseId);
			if (course) {

				var teachers = await db.user.findOneOrMoreByUserId(teacherId);
				if (!teachers) {
					e = error.badRequest('Invalid teacher ID');
					next(e);
				} else {
					var teacherIds = [];
					for (var teacher of teachers) {
						teacherIds.push(teacher.userId);
					}
					await db.course.deleteTeachers(courseId, teacherIds);
					await db.board.deleteUsersFromBoards(teacherIds);
					res.status(200).send({ err: 0 });
				}
			} else {
				e = error.badRequest('Invalid courseId');
				next(e);
			}
		} catch (err) {
			req.debug(debug,err);
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.badRequest('One or more fields missing');
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
