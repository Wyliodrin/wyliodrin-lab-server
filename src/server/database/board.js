var mongoose = require('mongoose');
var validator = require('validator');
var _ = require('lodash');
var debug = require('debug')('wyliodrin-lab-server:board-database');
debug.log = console.info.bind(console);

var boardSchema = mongoose.Schema({
	boardId: {
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
	userId: {
		type: String,
		required: false,
		unique: true,
	},
	status: {
		type: String,
		required: true,
		default: 'offline'
	},
	courseId: {
		type: String,
	},
	lastInfo: {
		type: Date,
		default: Date.now,
		required: true
	},
	command: {
		type: String
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

/**
 * Create a new board
 * @param {String} serial - serial number of the board
 * @param {String} userId - ID of user assigned to the board
 * @param {String} course - the course for which the board is used
 * @param {String} status - current status of the board
 */
function createBoard(serial, userId, course, status) {
	var board = new Board(_.assign({}, {
		serial: serial,
		user: userId,
		status: status,
		course: course
	}));

	return board.save();
}


function findByBoardId(boardId) {
	return Board.findOne({ boardId: boardId }).lean();
}

function findBySerial(boardSerial) {
	return Board.findOne({ serial: boardSerial });
}

function findByUser(userId) {
	return Board.findOne({ user: userId });
}

var board = {
	createBoard,
	findByBoardId,
	findBySerial,
	findByUser,
	status
};

module.exports = board;