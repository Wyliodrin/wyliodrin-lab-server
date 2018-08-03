var mongoose = require('mongoose');
var uuid = require('uuid');
var validator = require('validator');
var _ = require('lodash');
var debug = require('debug')('development:course-database');
debug.log = console.info.bind(console);

var courseSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function(name) {
				return validator.isAlphanumeric(name) &&
					name.length >= 3 && name.length <= 30;
			}
		}
	},
	courseId: {
		type: String,
		default: uuid.v4,
		required: true,
		unique: true
	},
	teachers: {
		type: [String]
	},
	students: {
		type: [String]
	}

}, {
	toObject: {
		transform: function(doc, ret) {
			delete ret.__v;
		}
	},
	toJSON: {
		transform: function(doc, ret) {
			delete ret.__v;
		}
	}
});

var Course = mongoose.model('Course', courseSchema);

/**
 * Create a new user
 * @param {String} name - name of the course
 * @param {[String]} students - ID's of students enrolled
 * @param {[String]} teachers = ID's of teachers managing course
 */
function createCourse(name, students, teachers) {
	var course = new Course(_.assign({}, {
		name: name,
		students: students,
		teachers: teachers
	}));

	return course.save();
}


function findByCourseId(courseId) {
	return Course.findOne({ courseId: courseId }).lean();
}

function findByName(courseName) {
	return Course.findOne({ name: courseName });
}

function addStudent(courseId, studentId) {
	return Course.findOneAndUpdate({ courseId: courseId, teachers: { $ne: studentId } }, { $addToSet: { students: studentId } });
}

function addTeacher(courseId, teacherId) {
	return Course.findOneAndUpdate({ courseId: courseId, students: { $ne: teacherId } }, { $addToSet: { teachers: teacherId } });
}

async function deleteStudent(courseId, studentId) {
	try {
		var course = await Course.findOne({ courseId });
	} catch (err) {
		debug(err);
		throw new Error()
	}

	if (!course) {
		return { err: 400 };
	}

	var index = course.students.indexOf(studentId);
	if (index === -1) {
		return { err: 400 };
	}
	course.students.splice(index, 1);
	return course.save();
}

function listAllCourses() {
	return Course.find();
}




async function getUserRole(courseId, userId) {
	try {
		var course = await findByCourseId(courseId);
	} catch (err) {
		debug(err);
		throw new Error('Problem querying database', err);
	}

	if (course.students.indexOf(userId) >= 0) return 'student';
	else if (course.teachers.indexOf(userId) >= 0) return 'teacher';
	else return 'none';

}

var course = {
	createCourse,
	findByCourseId,
	addStudent,
	addTeacher,
	findByName,
	getUserRole,
	listAllCourses,
	deleteStudent
}

module.exports = course;