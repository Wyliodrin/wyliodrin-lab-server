var mongoose = require('mongoose');
var validator = require('validator');
var _ = require('lodash');
var debug = require('debug')('wyliodrin-lab-server:board-database');
var moment = require ('moment');
debug.log = console.info.bind(console);
var socket = require ('../socket');
var db = require ('./database');

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
function createBoard(boardId, userId, courseId, ip) {
	var board = new Board(_.assign({}, {
		boardId: boardId,
		userId: userId,
		courseId: courseId,
		ip: ip
	}));

	return board.save();
}

function boardStatus(boardId, status, ip) {
	let update = {
		status
	};
	if (ip !== undefined) update.ip = ip;
	socket.emit ('user:board', boardId, 'send', 'u', { t: 'board', s: status });
	return Board.findOneAndUpdate({ boardId }, { $set: update, lastInfo: Date.now() }, { upsert: true, setDefaultsOnInsert: true, new: true }).lean();
}

// function resetCommand(boardId) {
// 	return Board.findOneAndUpdate({ boardId }, { $set: { command: null } }).lean();
// }


function findByBoardId(boardId) {
	return Board.findOne({ boardId: boardId }).lean();
}

function findByUserId(userId) {
	return Board.findOne({ userId: userId }).lean();
}

function findByUserIdAndBoardId(userId, boardId) {
	return Board.findOne({ boardId: boardId }, { userId: userId }).lean();
}

function assignUserToBoard(boardId, userId) {
	return Board.findOneAndUpdate({ boardId: boardId }, { userId: userId }).lean();
}

function assignCourseToBoard(boardId, courseId) {
	return Board.findOneAndUpdate({ boardId: boardId }, { courseId: courseId }).lean();
}

function assignCourseAndUser(boardId, userId, courseId) {
	return Board.findOneAndUpdate({ boardId: boardId, userId: null }, { $set: { userId: userId, courseId: courseId, lastInfo: Date.now() } }, { upsert: true, new: true }).lean();
}

function unassignCourseAndUser(userId) {
	return Board.findOneAndUpdate({ userId: userId }, { $unset: { courseId: '', userId: '' }, lastInfo: Date.now() }).lean();
}

function unsetCourseAndUser(boardId) {
	return Board.findOneAndUpdate({ boardId: boardId }, { $unset: { courseId: '', userId: '' }, lastInfo: Date.now() }).lean();
}

// function issueCommand(boardId, command) {
// 	return Board.findOneAndUpdate({ boardId }, { $set: { command: command }, lastInfo: Date.now() }, { upsert: true, new: true }).lean();
// }

function listBoards() {
	return Board.find().lean();
}

function listBoardsByCourseId(courseId) {
	return Board.find({ courseId: courseId });
}

function listAvailable() {
	return Board.find({ userId: null, status: 'online' }).lean();
}

function deleteUsersFromBoards(userIds) {
	return Board.findOneAndUpdate({ userId: { $in: userIds } }, { $unset: { userId: '' }, $set: { command: 'reboot' }, lastInfo: Date.now() }).lean();
}

function deleteByBoardId(boardId) {
	return Board.remove({ boardId });
}

var board = {
	createBoard,
	findByBoardId,
	boardStatus,
	// resetCommand,
	findByUserId,
	// issueCommand,
	assignUserToBoard,
	assignCourseToBoard,
	assignCourseAndUser,
	unassignCourseAndUser,
	unsetCourseAndUser,
	findByUserIdAndBoardId,
	listBoards,
	listBoardsByCourseId,
	listAvailable,
	deleteUsersFromBoards,
	deleteByBoardId
};

socket.on ('board:received', async function (boardId, label, data)
{
	if (data.l === 'p') {
		//ping pong
		let boardIdAway = data.i.boardId;

		if (boardIdAway) {
			let courseIdAway = data.i.courseId;
			let userIdAway = data.i.userId;
			let ipAway = data.i.ip;
			let statusAway = data.i.status || 'online';

			let board = await boardStatus(boardIdAway, statusAway, ipAway);

			if (statusAway === 'reboot' || statusAway === 'poweroff') db.image.unsetupDelay(boardIdAway);

			if (board) {
				if (board.courseId !== courseIdAway || board.userId !== userIdAway) {
					await board.boardStatus(boardIdAway, 'desync');
					socket.emit ('board', boardId, 'send', 'p' ,{ c: 'reboot' });
				} else {
					socket.emit ('board', boardId, 'send', 'p',{ c: board.command });
				}
			} else {
				socket.emit ('board', boardId, 'send', 'p',{ a: 'e', err: 'boardregistererror' });
			}
		} else {
			socket.emit ('board', boardId, 'send', 'p',{ a: 'e', err: 'boardiderror' });
		}

	}
});

async function refreshOffline ()
{
	try
	{
		let boards = await Board.update ({ lastInfo: {$lt: moment().subtract (process.env.WYLIODRIN_BOARD_OFFLINE_TIMEOUT || 60, 's').toDate ()} }, { status: 'offline' }, { new: true, multi: true });
		for (let board of boards)
		{
			socket.emit ('user:board', board.boardId, 'send', 'u', { t:'board', s: 'offline'});
		}
		// TODO flush product
		// await Promise.all ([db.cache.flushObject ('location:'+product.ownerId), db.cache.flushObject ('product:'+product.productId), db.cache.flushObject ('products:'+product.clusterId)]);
	}
	catch (e)
	{
		console.error ('Status update '+e.message);
	}
}

setInterval (refreshOffline, process.env.WYLIODRIN_BOARD_OFFLINE_TIMEOUT_REFRESH*1000 || 60*1000);

refreshOffline ();

module.exports = board;