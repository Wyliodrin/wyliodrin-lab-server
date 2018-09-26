var WebSocket = require('ws');
var msgpack = require('msgpack5')();
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var db = require('./database/database.js');
var url = require('url');
var tokenLib = require('./routes/redis-tokens.js');

let socketEvents = new EventEmitter ();

var userSockets = new EventEmitter();

var boardSockets = new EventEmitter();

socketEvents.on ('user', function (userId, command, label, data)
{
	userSockets.emit ('user:'+userId, command, label, data);
});

socketEvents.on ('user:board', async function (boardId, command, label, data)
{
	let board = await db.board.findByBoardId (boardId);
	if (board)
	{
		userSockets.emit ('user:'+board.userId, command, label, data);
		return true;
	}
	else return false;
});

socketEvents.on ('board', function (boardId, command, label, data)
{
	boardSockets.emit ('board:'+boardId, command, label, data);
});

// const EMIT_SOCK_SEND_PREFIX = 'socket:send:';
// var boardList = {};

function send(socket, label, data) {
	socket.send(msgpack.encode(_.assign({ l: label }, data)).toString('base64'));
}

function forward(socket, data) {
	socket.send(data);
}

function initSocket(route, server) {
	server.on('upgrade', function(req, socket, head) {
		const pathname = url.parse(req.url).pathname;
		if (pathname === route + '/socket/board') {
			socketBoards.handleUpgrade(req, socket, head, function done(ws) {
				socketBoards.emit('connection', ws, req);
			});
		} else
		if (pathname === route + '/socket/user') {
			socketUsers.handleUpgrade(req, socket, head, function done(ws) {
				socketUsers.emit('connection', ws, req);
			});
		} else {
			socket.destroy();
		}
	});

	var socketBoards = new WebSocket.Server({
		noServer: true,
		path: route + '/socket/board'
	});

	var socketUsers = new WebSocket.Server({
		noServer: true,
		path: route + '/socket/user'
	});

	socketBoards.on('connection', function(socket) {

		let authenticated = false;
		let token = false;

		let pushToSocket = function(command, label, data) {
			if (command === 'send')
			{
				send(socket, label, data);
			}
			else
			if (command === 'forward')
			{
				data = label;
				forward (socket, data);
			}
			else
			{
				if (command === 'disconnect')
				{
					socket.close ();
				}
			}
		};

		socket.on('message', async function(message) {
			let err = false;
			try {

				let data = msgpack.decode(new Buffer(message, 'base64'));
				if (authenticated === false) {
					if (await db.board.boardStatus(data.token, 'online', socket._socket.remoteAddress)) {
						//board found in database
						authenticated = true;
						token = data.token;
						// if (boardList[token] !== undefined) {
						// 	console.log('Websocket overwriting ond websocket for board ' + token);
						// }
						// boardList[token] = socket;
						boardSockets.on('board:'+token, pushToSocket);
					} else {
						socket.close();
					}
				} else if (authenticated === true) {
					if (data.l === 'b') {
						//shell for users
						// let found = await db.board.findByBoardId(token);
						// if (found !== null) {
						// 	let userToken = found.userId;
						// 	userSockets.emit('user:'+userToken, 'forward', message);
						// } else {
						// 	//board no longer in database
						// 	socket.close();
						// }
						if (!socketEvents.emit ('user:board', token, 'forward', message))
						{
							//board no longer in database
							socket.close ();
						}
					} 
					socketEvents.emit ('board:received', token, data.label, data);
				}

			} catch (e) {
				console.log(e);
				err = true;
			}
			if (err) {
				send(socket, { l: 'e', a: 'e', e: 'servererror' });
				socket.close();
			}
		});

		socket.on('close', async function() {
			await db.board.boardStatus(token, 'offline', null);
			// if (boardList[token] === undefined) {
			// 	console.log('Websocket closing and not in database for board ' + token);
			// }
			// boardList[token] = undefined;
			boardSockets.removeListener('board:'+token, pushToSocket);
		});

		socket.on('error', function(e) {
			console.log('WebSocket error : ' + e);
			send(socket, { l: 'e', a: 'e', e: 'servererror' });
		});
	});




	socketUsers.on('connection', function(socket) {

		console.log('connection');
		let authenticated = false;
		let token = null;
		let userId = null;

		let pushToSocket = function(command, label, data) {
			if (command === 'send')
			{
				send(socket, label, data);
			}
			else
			if (command === 'forward')
			{
				data = label;
				forward (socket, data);
			}
			else
			{
				if (command === 'disconnect')
				{
					socket.close ();
				}
			}
		};

		socket.on('message', async function(message) {
			let err = false;
			try {
				console.log(message);
				let data = msgpack.decode(new Buffer(message, 'base64'));
				token = data.token;
				if (authenticated === false) {
					userId = await tokenLib.get(token);
					if (userId !== null) {
						//user found in database
						authenticated = true;
						userSockets.on('user:'+userId, pushToSocket);
						send(socket, 'a', { err: 0 });
					} else {
						socket.close();
					}
				} else if (authenticated === true) {
					if (data.l === 'b') {
						//user shell
						let board = await db.board.findByUserIdAndBoardId(userId, data.id);
						if (board && board.ready) {
							boardSockets.emit ('board:'+data.id, 'forward', message);
						} else {
							// send(socket, 'b', { err: 'noboard' });
							userSockets.emit ('user:'+userId, 'send', 'b', { id: data.id, err: 'noboard' });
						}
					}
					socketEvents.emit ('user:'+data.l, userId, data);
					//  else if (data.l === 'b') {
					// 	//user shell
					// 	if (await db.board.findByUserIdAndBoardId(userId, data.id)) {
					// 		//userId (user) allowed to use board data.b (board id)
					// 		if (boardList[data.id] !== undefined) {
					// 			//board is on
					// 			forward(boardList[data.id], message);
					// 		} else {
					// 			send(socket, 'b', { err: 'noboard' });
					// 		}
					// 	}
					// }
				}

			} catch (e) {
				console.log(e);
				err = true;
			}
			if (err) {
				send(socket, 'e', { err: 'servererror' });
				socket.close();
			}
		});

		socket.on('close', function() {
			userSockets.removeListener('user:'+userId, pushToSocket);
		});

		socket.on('error', function(e) {
			console.log('WebSocket error : ' + e);
			send(socket, 'e', { err: 'servererror' });
		});
	});
}

module.exports = socketEvents;

module.exports.initSocket = initSocket;