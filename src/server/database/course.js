var mongoose = require('mongoose');
var uuid = require('uuid');
var validator = require('validator');
var _ = require('lodash');
var debug = require('debug')('wyliodrin-lab-server:course-database');
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
		type: [String],
		required: true,
		default: []
	},
	students: {
		type: [String],
		required: true,
		default: []
	},
	imageId: {
		type: String,
		required: true
	},
	open: {
		type: Boolean,
		required: true,
		default: false
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
 * @param {[String]} teachers - ID's of teachers managing course
 * @param {String} imageId - ID of the image designated for the course
 */
function createCourse(name, students, teachers, imageId) {
	var course = new Course(_.assign({}, {
		name: name,
		students: students,
		teachers: teachers,
		imageId: imageId
	}));

	return course.save();
}

async function editCourse(courseId, name, imageId) {
	var editCourse = {};
	if (name) {
		editCourse.name = name;
	}
	if (imageId) {
		editCourse.imageId = imageId;
	}
	let ret = await Course.updateOne({ courseId: courseId }, { $set: editCourse }).lean();
	return ret;
}


function findByCourseId(courseId) {
	return Course.findOne({ courseId: courseId }).lean();
}

function findByCourseIdAndTeacher(courseId, teacherId) {
	return Course.findOne({ courseId: courseId, teachers: teacherId }).lean();
}

function findByName(courseName) {
	return Course.findOne({ name: courseName }).lean();
}

function addStudent(courseId, studentId) {
	return Course.findOneAndUpdate({ courseId: courseId, teachers: { $ne: studentId } }, { $addToSet: { students: studentId } }).lean();
}

function addStudents(courseId, students) {
	return Course.findOneAndUpdate({ courseId: courseId, teachers: { $ne: students } }, { $addToSet: { students: students } }).lean();
}

function addTeacher(courseId, teacherId) {
	return Course.findOneAndUpdate({ courseId: courseId, students: { $ne: teacherId } }, { $addToSet: { teachers: teacherId } }).lean();
}

function deleteStudents(courseId, studentIds) {
	return Course.findOneAndUpdate({ courseId: courseId }, { $pull: { students: { $in: studentIds } } });
}

function deleteTeachers(courseId, teacherIds) {
	return Course.findOneAndUpdate({ courseId: courseId }, { $pull: { teachers: { $in: teacherIds } } });
}

// async function deleteTeacher(courseId, teacherId) {
// 	try {
// 		var course = await Course.findOne({ courseId }).lean();
// 	} catch (err) {
// 		debug(err);
// 		throw new Error('Got error querying database', err);
// 	}

// 	if (!course) {
// 		return { err: 400 };
// 	}

// 	var index = course.teachers.indexOf(teacherId);
// 	if (index === -1) {
// 		return { err: 400 };
// 	}
// 	course.teachers.splice(index, 1);
// 	return course.save();
// }

function deleteByCourseId(courseId) {
	return Course.remove({ courseId });
}

function removeImage(imageId) {
	return Course.update({ imageId }, { $unset: { imageId: '' } }, { multi: true }).lean();
}

function listCoursesByImageId(imageId) {
	return Course.find({ imageId });
}

function listAllCourses() {
	return Course.find({});
}

function listPublicCourses() {
	return Course.find({}, { courseId: 1, name: 1 });
}

async function getUserRole(courseId, userId) {
	try {
		var course = await findByCourseId(courseId).lean();
	} catch (err) {
		debug(err);
		throw new Error('Problem querying database', err);
	}

	if (course.students.indexOf(userId) >= 0) return 'student';
	else if (course.teachers.indexOf(userId) >= 0) return 'teacher';
	else return 'none';

}

function findByStudentId(studentId) {
	return Course.find({ students: studentId });
}

function findByCourseIdAndStudentId(courseId, studentId) {
	return Course.findOne({ $and: [{ courseId: courseId }, { $or: [{ students: studentId }, { open: true }] }] }).lean();
}

function findByCourseAndUserId(courseId, userId) {
	return Course.findOne({ $and: [{ courseId: courseId }, { $or: [{ students: { $in: userId } }, { teachers: { $in: userId } }] }] });
}

function findByImageId(imageId) {
	return Course.find({ imageId: imageId }).lean();
}

var course = {
	createCourse,
	findByCourseId,
	addStudent,
	addTeacher,
	findByName,
	getUserRole,
	removeImage,
	listCoursesByImageId,
	listAllCourses,
	listPublicCourses,
	// deleteStudent,
	// deleteTeacher,
	deleteByCourseId,
	findByStudentId,
	findByCourseIdAndStudentId,
	findByCourseIdAndTeacher,
	editCourse,
	addStudents,
	deleteStudents,
	deleteTeachers,
	findByCourseAndUserId,
	findByImageId
};

module.exports = course;