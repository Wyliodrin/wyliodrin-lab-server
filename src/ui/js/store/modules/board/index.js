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
		board: null
	},
	getters: {
		board(state) {
			return state.board;
		},
	},
	actions: {
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
				// console.log('Login fail ' + e);
				return false;
			}
		},
	},
	mutations: {
		board(state, value) {
			state.board = value;
		},
	}
};