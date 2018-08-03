var mongoose = require('mongoose');
var uuid = require('uuid');
var validator = require('validator');
//var _ = require('lodash');
var db = require('./database');

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

function findByCourseId(courseId) {
	return Course.findOne({ courseId: courseId }).lean();
}

function findByName(courseName) {
	return Course.findOne({ name: courseName });
}