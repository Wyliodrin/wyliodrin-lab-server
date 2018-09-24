var Vue = require('vue');
var setup = require('../../setup.js');

// var KEY_TOKEN = 'wyliodrin.token';
// Vue.http.interceptors.push(function(request, next) {
// 	if (window.localStorage.getItem(KEY_TOKEN)) {
// 		request.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem(KEY_TOKEN));
// 	}
// 	next();
// });

module.exports = {
	namespaced: true,
	state: {
		boards: null,
		board: null,
		courseBoards: null,
	},
	getters: {
		board(state) {
			return state.board;
		},
		boards (state) {
			return state.boards;
		},
		courseBoards (state) {
			return state.courseBoards;
		}
	},
	actions: {
		init (store)
		{
			Vue.socket.on ('board', function (data)
			{
				console.log ('board');
				store.commit ('board', data);
			});
		},
		async listBoards (store)
		{
			try {
				// store.commit ('boards', null);
				let response = await Vue.http.get(setup.API + '/boards/list');
				// console.log(response.data.role);
				if (response.data.err === 0) {
					store.commit('boards', response.data.boards);
				}
				return true;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message: 'You couldn\'t log in!<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async command(store, data) {
			try {
				let response = await Vue.http.post(setup.API + '/boards/command', {
					boardId: data.boardId,
					command: data.command
				});
				// console.log(response.data.role);
				if (response.data.err === 0) {
					return true;
				}
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message: 'You couldn\'t send '+data.command+'!<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async getBoard(store) {
			try {
				store.commit ('board', null);
				let response = await Vue.http.get(setup.API + '/boards/user');
				// console.log(response.data.role);
				if (response.data.err === 0) {
					store.commit('board', response.data.board);
				}
				return true;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message: 'You couldn\'t log in!<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async disconnect(store, boardId) {
			try {
				let response = await Vue.http.post(setup.API + '/boards/disconnect', {
					boardId
				});
				// console.log(response.data.role);
				if (response.data.err === 0) {
					return true;	
				}
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message: 'You couldn\'t disconnect the board!<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async del(store, boardId) {
			try {
				let response = await Vue.http.post(setup.API + '/boards/remove', {
					boardId
				});
				// console.log(response.data.role);
				if (response.data.err === 0) {
					return true;	
				}
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message: 'You couldn\'t delete the board!<br>Server error: ' + e.body.err});
				return false;
			}
		},
		async listCourseBoards (store, courseId)
		{
			try {
				// store.commit ('boards', null);
				let response = await Vue.http.get(setup.API + '/boards/list/'+courseId);
				// console.log(response.data.role);
				if (response.data.err === 0) {
					store.commit('courseBoards', response.data.boards);
				}
				return true;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message: 'You couldn\'t log in!<br>Server error: ' + e.body.err});
				return false;
			}
		},
	},
	mutations: {
		boards(state, value) {
			state.boards = value;
		},
		board(state, value) {
			state.board = value;
		},
		courseBoards(state, value) {
			state.courseBoards = value;
		},
	}
};