var WebSocket = require('ws');
var msgpack = require('msgpack5')();
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var db = require('./database/database.js');
var raspberrypi = db.image;
var url = require('url');
var tokenLib = require('./routes/redis-tokens.js');

const EMIT_SOCK_SEND_PREFIX = 'socket:send:';

var userList = new EventEmitter();
var boardList = {};

var openCourses = {};

function send(socket, label, data) {
	socket.send(msgpack.encode(_.assign({ l: label }, data)).toString('base64'));
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

		socket.on('message', async function(message) {
			let err = false;
			try {

				let data = msgpack.decode(message);
				if (authenticated === false) {
					if (await db.board.findByBoardId(data.token)) {
						//board found in database
						authenticated = true;
						token = data.token;
						if (boardList[token] !== undefined) {
							console.log('Websocket overwriting ond websocket for board ' + token);
						}
						boardList[token] = socket;

					} else {
						socket.close();
					}
				} else if (authenticated === true) {
					if (data.l === 'b') {
						//shell for users
						let found = await db.board.findByBoardId(token);
						if (found !== null) {
							let userToken = found.userId;
							userList.emit(EMIT_SOCK_SEND_PREFIX + userToken, data);
						} else {
							//board no longer in database
							socket.close();
						}
					} else if (data.l === 'p') {
						//ping pong
						let boardIdAway = data.i.boardId;

						if (boardIdAway) {
							let courseIdAway = data.i.courseId;
							let userIdAway = data.i.userId;
							let ipAway = data.i.ip;
							let statusAway = data.i.status;

							let board = await db.board.boardStatus(boardIdAway, statusAway, ipAway);

							if (statusAway === 'reboot' || statusAway === 'poweroff') db.image.unsetupDelay(boardIdAway);

							if (board) {
								if (board.courseId !== courseIdAway || board.userId !== userIdAway) {
									await db.board.boardStatus(boardIdAway, 'desync');
									send(socket, { t: 'p', c: 'reboot' });
								} else {
									if (board.command) {
										await db.board.resetCommand(boardIdAway);
									}
									send(socket, { t: 'p', c: board.command });
								}
							} else {
								send(socket, { t: 'e', a: 'e', e: 'boardregerror' });
							}
						} else {
							send(socket, { t: 'e', a: 'e', e: 'boardiderror' });
						}

					}

				}

			} catch (e) {
				console.log(e);
				err = true;
			}
			if (err) {
				send(socket, { t: 'e', a: 'e', e: 'servererror' });
				socket.close();
			}
		});

		socket.on('close', function() {
			if (boardList[token] === undefined) {
				console.log('Websocket closing and not in database for board ' + token);
			}
			boardList[token] = undefined;
		});

		socket.on('error', function(e) {
			console.log('WebSocket error : ' + e);
			send(socket, { t: 'e', a: 'e', e: 'servererror' });
		});
	});




	socketUsers.on('connection', function(socket) {

		console.log('connection');
		let authenticated = false;
		let token = null;
		let userId = null;

		let pushToSocket = function(label, data) {
			if (data.l === 's' && data.a === 'c'){
				if (openCourses[userId] !== undefined && openCourses[userId][data.id] !== undefined) {
					openCourses[userId][data.id] = undefined;
				}
			}
			if (authenticated) {
				send(socket, label, data);
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
						userList.on(EMIT_SOCK_SEND_PREFIX + userId, pushToSocket);
						send(socket, 'a', { err: 0 });
					} else {
						socket.close();
					}
				} else if (authenticated === true) {
					if (data.l === 's') {
						//shell for courses
						if (await db.course.findByCourseIdAndTeacher(data.id, userId)) {
							console.log('course shell');
							let courseId = data.id;
							//userId (user prof) allowed to modify course data.id
							if (data.a === 'o') {
								//open
								let userShells = openCourses[userId];
								if (userShells === undefined) {
									openCourses[userId] = {};
								}
								let currentCourse = openCourses[userId][courseId];
								if (currentCourse === undefined) {
									openCourses[userId][courseId] = await raspberrypi.setupCourse(courseId, undefined, userList, EMIT_SOCK_SEND_PREFIX + userId);
								}
							} else if (data.a === 'c') {
								//close
								let userShells = openCourses[userId];
								if (userShells !== undefined) {
									let currentCourse = openCourses[userId][courseId];
									if (currentCourse) {
										currentCourse.kill();
										openCourses[userId][courseId] = undefined;
									} else {
										send(socket, 's', { a: 'e', id: courseId, err: 'noshell' });
									}
								} else {
									send(socket, 's', { a: 'e', id: courseId, err: 'noshell' });
								}
							} else if (data.a === 'k') {
								//key
								let userShells = openCourses[userId];
								if (userShells !== undefined) {
									let currentCourse = openCourses[userId][courseId];
									if (currentCourse) {
										if (_.isString(data.t) || _.isBuffer(data.t)) {
											currentCourse.write(data.t);
										}
									} else {
										send(socket, 's', { a: 'e', id: courseId, err: 'noshell' });
									}
								} else {
									send(socket, 's', { a: 'e', id: courseId, err: 'noshell' });
								}
							} else if (data.a === 'r') {
								//resize
								let userShells = openCourses[userId];
								if (userShells !== undefined) {
									let currentCourse = openCourses[userId][courseId];
									if (currentCourse) {
										currentCourse.resize(data.c, data.r);
									} else {
										send(socket, 's', { a: 'e', id: courseId, err: 'noshell' });
									}
								} else {
									send(socket, 's', { a: 'e', id: courseId, err: 'noshell' });
								}
							}
						} else {
							send(socket, 's', { id: data.id, err: 'noteacher' });
						}
					} else if (data.l === 'b') {
						//user shell
						if (await db.board.findByUserIdAndBoardId(userId, data.b)) {
							//userId (user) allowed to use board data.b (board id)
							if (boardList[data.b] !== undefined) {
								//board is on
								send(boardList[data.b], 'b', message);
							} else {
								send(socket, 'b', { err: 'noboard' });
							}
						}
					}
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
			userList.removeListener(EMIT_SOCK_SEND_PREFIX + userId, pushToSocket);
		});

		socket.on('error', function(e) {
			console.log('WebSocket error : ' + e);
			send(socket, 'e', { err: 'servererror' });
		});
	});
}

module.exports.initSocket = initSocket;