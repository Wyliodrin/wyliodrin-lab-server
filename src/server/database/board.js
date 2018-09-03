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
		sparse: true
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
	},
	ip: {
		type: String,
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
function createBoard(boardId, userId, courseId, command, ip) {
	var board = new Board(_.assign({}, {
		boardId: boardId,
		userId: userId,
		command: command,
		courseId: courseId,
		ip: ip
	}));

	return board.save();
}

function boardStatus(boardId, status) {
	return Board.findOneAndUpdate({ boardId }, { $set: { status: status }, lastInfo: Date.now() }, { upsert: true, new: true }).lean();
}

function resetComand (boardId)
{
	return Board.findOneAndUpdate ({boardId}, {$set: {command: null}}).lean();
}


function findByBoardId(boardId) {
	return Board.findOne({ boardId: boardId }).lean();
}

// function findBySerial(boardSerial) {
// 	return Board.findOne({ serial: boardSerial });
// }

function findByUserId(userId) {
	return Board.findOne({ userId: userId });
}

function findByUserIdAndBoardId(userId, boardId) {
	return Board.findOne({ boardId: boardId }, { userId: userId }).lean();
}

function assignUserToBoard(boardId, userId) {
	return Board.findOneAndUpdate({ boardId: boardId }, { userId: userId });
}

function assignCourseToBoard(boardId, courseId) {
	return Board.findOneAndUpdate({ boardId: boardId }, { courseId: courseId });
}

function assignCourseAndUser(boardId, userId, courseId) {
	return Board.findOneAndUpdate({ boardId: boardId }, { $set: { userId: userId, courseId: courseId, command: 'reboot', lastInfo: Date.now() } }, { upsert: true, new: true }).lean();
}

function unsetCourseAndUser(boardId) {
	return Board.findOneAndUpdate({ boardId: boardId }, { $unset: { courseId: '', userId: '' }, $set: { command: 'reboot' }, lastInfo: Date.now() }).lean();
}

function issueCommand(boardId, command) {
	return Board.findOneAndUpdate({ boardId }, { $set: { command: command }, lastInfo: Date.now() }, { upsert: true, new: true }).lean();
}

var board = {
	createBoard,
	findByBoardId,
	// findBySerial,
	boardStatus,
	resetComand,
	findByUserId,
	issueCommand,
	assignUserToBoard,
	assignCourseToBoard,
	assignCourseAndUser,
	unsetCourseAndUser,
	findByUserIdAndBoardId
};

module.exports = board;