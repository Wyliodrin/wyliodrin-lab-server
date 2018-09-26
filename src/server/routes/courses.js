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
		req.debug(debug, 'Listing public courses');
		var courses = await db.course.listPublicCourses();
		for (var course of courses) {
			delete course._id;
		}
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		req.debug(debug, 'Error listing courses' + err);
		e = error.serverError(err);
		next(e);
	}
});

privateApp.get('/', async function(req, res, next) {
	var e;
	var userId = req.user.userId;

	try {
		req.debug(debug, 'Finding courses by user');
		var courses = await db.course.findByUserId(userId);
		for (var course of courses) {
			delete course.__v;
			delete course._id;
		}
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		req.debug(debug, 'Error finding courses by user' + err);
		e = error.serverError(err);
		next(e);
	}

});

privateApp.post('/students/remove', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;

	req.debug(debug, 'User can add students');
	if (userCanAddStudents(req.user, courseId)) {
		try {
			req.debug(debug, 'Finding one or more students');
			var students = await db.user.findOneOrMoreByUserId(studentId);
		} catch (err) {
			req.debug(debug, 'Error finding one or more students');
			e = error.serverError(err);
			return next(e);
		}
		if (!students) {
			req.debug(debug, 'Invalid student ID');
			e = error.badRequest('Invalid student ID');
			next(e);
		} else {
			var studentIds = [];
			for (var student of students) {
				studentIds.push(student.userId);
			}
			try {
				req.debug(debug, 'Deleting students: ' + studentIds);
				await db.course.deleteStudents(courseId, studentIds);
			} catch (err) {
				req.debug(debug, 'Error Deleting students ' + err);
				e = error.serverError(err);
				return next(e);
			}

			try {
				req.debug(debug, 'Deleting users from boards: ');
				await db.board.deleteUsersFromBoards(studentIds);
			} catch (err) {
				req.debug(debug, 'Error deleting users from boards' + err);
				e = error.serverError(err);
				return next(e);
			}
			res.status(200).send({ err: 0 });
		}
	} else {
		req.debug(debug, 'User cannot add students');
		e = error.unauthorized('User cannot add students');
		next(e);
	}

});

privateApp.post('/image', async function(req, res, next) {
	var e;
	var imageId = req.body.imageId;
	var courseId = req.body.courseId;

	if (userCanAddStudents(req.user, courseId)) {
		req.debug(debug, 'User can add students');
		try {
			if (db.image.existsImageId(imageId)) {
				req.debug(debug, 'Image exists');
				// await db.image.removeSetupCourse(courseId);
				req.debug(debug, 'Editing course');
				await db.course.editCourse(courseId, null, imageId);
				res.send({ err: 0 });
			}
		} catch (err) {
			req.debug(debug, 'Error editing course' + err);
			e = error.serverError(err);
			next(e);
		}
	} else {
		e = error.unauthorized('User cannot change image');
		next(e);
	}

});

privateApp.post('/students/add', async function(req, res, next) {
	var e;
	var studentId = req.body.studentId;
	var courseId = req.body.courseId;

	if (userCanAddStudents(req.user, courseId)) {
		req.debug(debug, 'User can add students');
		try {
			req.debug(debug, 'Finding one or more by userId');
			var students = await db.user.findOneOrMoreByUserId(studentId);
		} catch (err) {
			req.debug(debug, 'Error finding one or more by userId');
			e = error.serverError(err);
			return next(e);
		}
		if (!students) {
			e = error.badRequest('Invalid student ID');
			next(e);
		} else {
			var studentIds = [];
			for (var student of students) {
				studentIds.push(student.userId);
			}
			try {
				req.debug(debug, 'Adding students');
				await db.course.addStudents(courseId, studentIds);
			} catch (err) {
				req.debug(debug, 'Error adding students' + err);
				e = error.serverError(err);
				next(e);
			}
			res.status(200).send({ err: 0 });
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
		req.debug(debug, 'Finding image by Id');
		var courses = await db.course.findByImageId(imageId);
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		req.debug(debug, 'Error finding image by Id');
		e = error.serverError(err);
		next(e);
	}
});


adminApp.get('/all', async function(req, res, next) {
	var e;
	try {
		req.debug(debug, 'Listing all courses');
		var courses = await db.course.listAllCourses();
		for (var course of courses) {
			delete course.__v;
			delete course._id;
		}
		res.status(200).send({ err: 0, courses });
	} catch (err) {
		req.debug(debug, 'Error listing courses' + err);
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
		req.debug(debug, 'Creating course');
		var course = await db.course.createCourse(name, students, teachers, imageId);
		if (course) {
			res.status(200).send({ err: 0, course });
		} else {
			e = error.badRequest('One or more invalid fields');
			next(e);
		}
	} catch (err) {
		req.debug(debug, 'Error creating course' + err);
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/remove', async function(req, res, next) {
	var e;
	var courseId = req.body.courseId;
	try {
		req.debug(debug, 'Listing boards by course ID');
		var boards = await db.board.listBoardsByCourseId(courseId);
	} catch (err) {
		req.debug(debug, 'Error listing boards by course ID' + err);
		e = error.serverError(err);
		return next(err);
	}
	if (boards && boards.length === 0) {
		try {
			req.debug(debug, 'Delete by courseId');
			await db.course.deleteByCourseId(courseId);
		} catch (err) {
			req.debug(debug, 'Error deleting course by courseID' + err);
			e = error.serverError(err);
			return next(err);
		}
		try {
			req.debug(debug, 'Removing setup user course');
			await db.image.removeSetupUserCourse(courseId);
		} catch (err) {
			req.debug(debug, 'Error removing setup user course' + err);
			e = error.serverError(err);
			return next(err);
		}
		try {
			req.debug(debug, 'Removing setup course');
			await db.image.removeSetupCourse(courseId);
		} catch (err) {
			req.debug(debug, 'Error removing setup course' + err);
			e = error.serverError(err);
			return next(err);
		}
		res.status(200).send({ err: 0 });
	} else {
		e = error.unauthorized('Please disconnect all boards from course');
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
			req.debug(debug, 'Editing course');
			await db.course.editCourse(courseId, name, imageId);
			res.status(200).send({ err: 0 });
		} catch (err) {
			req.debug(debug, 'Error editing course' + err.message);
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
		req.debug(debug, 'Finding course by course Id');
		var course = await db.course.findByCourseId(courseId);
		if (course) {
			res.status(200).send({ err: 0, course });
		} else {
			e = error.badRequest('Course not found');
			next(e);
		}
	} catch (err) {
		req.debug(debug, 'Error finding course by course Id' + err);
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
			req.debug(debug, 'Finding by course ID');
			var course = await db.course.findByCourseId(courseId);
		} catch (err) {
			req.debug(debug, 'Finding by course ID' + err);
			e = error.serverError(err);
			return next(e);
		}
		if (course) {

			try {
				req.debug(debug, 'Finding one or more by user ID');
				var teachers = await db.user.findOneOrMoreByUserId(teacherId);
			} catch (err) {
				req.debug(debug, 'Error finding one or more by user ID' + err);
				e = error.serverError(err);
				return next(e);
			}
			if (!teachers) {
				e = error.badRequest('Invalid teacher ID');
				next(e);
			} else {
				var teacherIds = [];
				for (var teacher of teachers) {
					teacherIds.push(teacher.userId);
				}
				try {
					req.debug(debug, 'Deleting teachers');
					await db.course.deleteTeachers(courseId, teacherIds);
				} catch (err) {
					req.debug(debug, 'Error deleting teachers' + err);
					e = error.serverError(err);
					return next(e);
				}
				try {
					req.debug(debug, 'Deleting users from boards');
					await db.board.deleteUsersFromBoards(teacherIds);
				} catch (err) {
					req.debug(debug, 'Error deleting users from boards' + err);
					e = error.serverError(err);
					return next(e);
				}
				res.status(200).send({ err: 0 });
			}
		} else {
			e = error.badRequest('Invalid courseId');
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
		req.debug(debug, 'Finding user by userId');
		var user = await db.user.findByUserId(teacherId);
	} catch (err) {
		req.debug(debug, 'Error finding user by userId' + err);
		e = error.serverError(err);
		return next(e);
	}
	if (user) {
		try {
			req.debug(debug, 'Adding teacher');
			await db.course.addTeacher(courseId, teacherId);
		} catch (err) {
			req.debug(debug, 'Error adding teacher' + err);
			e = error.serverError(err);
			return next(e);

		}
		res.status(200).send({ err: 0 });
	} else {
		e = error.badRequest('Invalid user Id');
		next(e);
	}
});

module.exports.publicRoutes = publicApp;
module.exports.adminRoutes = adminApp;
module.exports.privateRoutes = privateApp;