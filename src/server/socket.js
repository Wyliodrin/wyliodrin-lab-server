var WebSocket = require ('ws');
var msgpack = require('msgpack5');
var EventEmitter = require ('events').EventEmitter;
var _ = require('lodash');
var db = require('./database/database.js');
var raspberrypi = db.image;

const EMIT_SOCK_SEND_PREFIX = 'socket:send:';

var userList = new EventEmitter ();
var boardList = {};

var openCourses = {};

function send(socket, data){
	socket.send(msgpack.encode(data));
}

function initSocket(route, server){
	server.on ('upgrade', function (req)
	{
		console.log (req.headers);
	});

	var socketBoards = new WebSocket.Server ({
		server,
		path: route+'/socket/board'
	});

	var socketUsers = new WebSocket.Server ({
		server,
		path: route+'/socket/user'
	});

	socketBoards.on ('connection', function (socket){

		let authenticated = false;
		let token = false;

		socket.on ('message', async function (message){
			let err = false;
			try
			{

				let data =  msgpack.decode (message);
				if (authenticated === false){
					if (await db.board.findByBoardId(data.token)){
						//board found in database
						authenticated = true;
						token = data.token;
						if (boardList[token] !== undefined){
							console.log('Websocket overwriting ond websocket for board ' + token);
						}
						boardList[token] = socket;
						
					}
					else{
						socket.close ();
					}
				}
				else if (authenticated === true){
					if (data.t === 'u'){
						//shell for users
						let found = await db.board.findByBoardId(token);
						if (found !== null){
							let userToken = found.userId;
							userList.emit(EMIT_SOCK_SEND_PREFIX + userToken, data);
						}
						else{
							//board no longer in database
							socket.close();
						}
					}
					else if (data.t === 'p'){
						//ping pong
						let boardIdAway = data.i.boardId;

						if (boardIdAway) {
							let courseIdAway = data.i.courseId;
							let userIdAway = data.i.userId;
							let ipAway = data.i.ip;
							let statusAway = data.i.status;

							let board = await db.board.boardStatus(boardIdAway, statusAway, ipAway);

							if (status === 'reboot' || status === 'poweroff') db.image.unsetupDelay (boardIdAway);

							if (board) {
								if (board.courseId !== courseIdAway || board.userId !== userIdAway) {
									await db.board.boardStatus(boardIdAway, 'desync');
									send(socket, {t:'p', c:'reboot'});
								} else {
									if (board.command) {
										await db.board.resetCommand(boardIdAway);
									}
									send(socket, {t:'p', c:board.command});
								}
							} else {
								send(socket, {t:'e', a:'e', e:'boardregerror'});
							}
						} else {
							send(socket, {t:'e', a:'e', e:'boardiderror'});
						}
					
					}

				}

			}
			catch (e)
			{
				console.log (e);
				err = true;
			}
			if (err)
			{
				send(socket, {t:'e', a:'e', e:'servererror'});
				socket.close ();
			}
		});

		socket.on ('close', function (){
			if (boardList[token] === undefined){
				console.log('Websocket closing and not in database for board ' + token);
			}
			boardList[token] = undefined;
		});

		socket.on ('error', function (e){
			console.log('WebSocket error : ' + e);
			send(socket, {t:'e', a:'e', e:'servererror'});
		});
	});




	socketUsers.on ('connection', function (socket){

		let authenticated = false;
		let token = null;

		let pushToSocket = function(data){
			if (authenticated){
				send(socket, data);
			}
		};

		socket.on ('message', async function (message){
			let err = false;
			try
			{

				let data =  msgpack.decode (message);
				if (authenticated === false){
					if (await db.user.findByUserId(data.token)){
						//user found in database
						authenticated = true;
						token = data.token;
						userList.on(EMIT_SOCK_SEND_PREFIX + token, pushToSocket);
						
					}
					else{
						socket.close ();
					}
				}
				else if (authenticated === true){
					if (data.t === 's'){
						//shell for courses
						if (await db.board.findByCourseIdAndTeacher(data.b, token)){ 
							//token (user prof) allowed to modify course data.b
							if (data.a === 'o'){
								//open
								let currentCourse = openCourses[token];
								if (!currentCourse){
									openCourses[token] = await raspberrypi.setupCourse(data.b, undefined, userList, EMIT_SOCK_SEND_PREFIX + token);
								}
							}
							else if (data.a === 'c'){
								//close
								let currentCourse = openCourses[token];
								if (currentCourse){
									currentCourse.kill();
								}
								else{
									send(socket, {t:'s', a:'e', e:'noshell'});
								}
								openCourses[token] = undefined;
							}
							else if (data.a === 'k'){
								//key
								let currentCourse = openCourses[token];
								if (currentCourse){
									if (_.isString(data.c) || _.isBuffer (data.c)){
										currentCourse.write(data.c);
									}
								}
								else{
									send(socket, {t:'s', a:'e', e:'noshell'});
								}
							}
							else if (data.a === 'r'){
								//resize
								let currentCourse = openCourses[token];
								if (currentCourse){
									currentCourse.resize(data.c, data.d);
								}
								else{
									send(socket, {t:'s', a:'e', e:'noshell'});
								}
							}
						}
					}

					else if (data.t === 'u'){
						//user shell
						if (await db.board.findByUserIdAndBoardId(token, data.b)){ 
							//token (user) allowed to use board data.b (board token)
							if (boardList[data.b] !== undefined){
								//board is on
								send(boardList[data.b], message);
							}
							else{
								send(socket, {t:'s', a:'e', e:'noboard'});
							}
						}
					}
				}

			}
			catch (e)
			{
				console.log (e);
				err = true;
			}
			if (err)
			{
				send(socket, {t:'e', a:'e', e:'servererror'});
				socket.close ();
			}
		});

		socket.on ('close', function (){
			userList.removeListener(EMIT_SOCK_SEND_PREFIX + token, pushToSocket);
		});

		socket.on ('error', function (e){
			console.log('WebSocket error : ' + e);
			send(socket, {t:'e', a:'e', e:'servererror'});
		});
	});
}

module.exports.initSocket = initSocket;