// var mongoose = require('mongoose');
// var uuid = require('uuid');
// var validator = require('validator');
// var _ = require('lodash');
// var debug = require('debug')('wyliodrin-lab-server:board-database');
// debug.log = console.info.bind(console);

// var boardSchema = mongoose.Schema({
// 	boardId: {
// 		type: String,
// 		required: true,
// 		default: uuid.v4,
// 		unique: true
// 	},
// 	serial: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 		validate: {
// 			validator: function(name) {
// 				return validator.isAlphanumeric(name) &&
// 					name.length >= 3 && name.length <= 30;
// 			}
// 		}
// 	},
// 	user: {
// 		type: String,
// 		required: true,
// 		default: 'default'
// 	},
// 	status: {
// 		type: String,
// 		required: true,
// 		default: 'offline'
// 	},
// 	course: {
// 		type: String,
// 		required: true,
// 		default: 'default'
// 	},
// 	lastInfo: {
// 		type: Date,
// 		default: Date.now,
// 		required: true
// 	}
// }, {
// 	toObject: {
// 		transform: function(doc, ret) {
// 			delete ret.__v;
// 		}
// 	},
// 	toJSON: {
// 		transform: function(doc, ret) {
// 			delete ret.__v;
// 		}
// 	}
// });

// var Board = mongoose.model('Board', boardSchema);

<<<<<<< HEAD
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
=======
// /**
//  * Create a new board
//  * @param {String} serial - serial number of the board
//  * @param {String} userId - ID of user assigned to the board
//  * @param {String} course - the course for which the board is used
//  * @param {String} status - current status of the board
//  */
// function createBoard(serial, user, course, status) {
// 	var board = new Board(_.assign({}, {
// 		serial: serial,
// 		user: userId,
// 		status: status,
// 		course: course
// 	}));
>>>>>>> e3c9a3413946906a0aff30006330562a5c0bb617

// 	return board.save();
// }


// function findByBoardId(boardId) {
// 	return Board.findOne({ boardId: boardId }).lean();
// }

<<<<<<< HEAD
function findBySerial(boardSerial) {
	return Board.findOne({ serial: boardSerial });
}

function findByUser(userId) {
	return Board.findOne({ user: userId });
}
=======
// function findBySerial(boardSerial) {
// 	return Course.findOne({ serial: boardSerial });
// }

// function findByUser(userId) {
// 	return Course.findOne({ user: userId });
// }
>>>>>>> e3c9a3413946906a0aff30006330562a5c0bb617

// var board = {
// 	createBoard,
// 	findByBoardId,
// 	findBySerial,
// 	findByUser
// };

// module.exports = board;