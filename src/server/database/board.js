var mongoose = require('mongoose');
var uuid = require('uuid');
var validator = require('validator');
//var _ = require('lodash');
var debug = require('debug')('development:board-database');
debug.log = console.info.bind(console);

var boardSchema = mongoose.Schema({
	boardId: {
		type: String,
		required: true,
		default: uuid.v4,
		unique: true
	},
	serial: {
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
	user: {
		type: String,
		required: true,
		default: 'default'
	},
	status: {
		type: String,
		required: true,
		default: 'offline'
	},
	course: {
		type: String,
		required: true,
		default: 'default'
	},
	lastInfo: {
		type: Date,
		default: Date.now,
		required: true
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

var Board = mongoose.model('Board', boardSchema);
debug(Board);