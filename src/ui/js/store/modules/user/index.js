var Vue = require('vue');
var setup = require('../../setup.js');

var KEY_TOKEN = 'wyliodrin.token';
Vue.http.interceptors.push(function(request, next) {
	if (window.localStorage.getItem(KEY_TOKEN)) {
		request.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem(KEY_TOKEN));
	}
	next();
});

module.exports = {
	namespaced: true,
	state: {
		token: window.localStorage.getItem(KEY_TOKEN),
		role: null,
		user: null,
		userById: null,
		users: null
	},
	getters: {
		token(state) {
			return state.token;
		},
		role(state) {
			return state.role;
		},
		isLoggedIn(state) {
			return state.token && state.token !== '';
		},
		user(state) {
			return state.user;
		},
		userById(state) {
			return state.userById;
		},
		users(state) {
			return state.users;
		}
	},
	actions: {
		async login(store, credentials) {
			try {
				let response = await Vue.http.post(setup.API + '/users/login', credentials);
				console.log(response.data.role);
				if (response.data.token) {
					store.commit('token', response.data.token);
					store.commit('role', response.data.role);
				}
				return true;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning', message:'Couldn\'t login.<br>Server error: ' + e.status});
				return false;
			}
		},
		async logout(store) {
			try {
				let response = await Vue.http.get(setup.API + '/users/logout');
				store.commit('token', null);
				if (response.data.err === 0) {
					return true;
				} else {
					Vue.toast.warning({title:'Warning', message:'Couldn\'t logout.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning', message:'Couldn\'t logout.<br>Server error: ' + e.status});
				return false;
			}
		},
		async getAllUsers(store) {
			try {
				store.commit('users', null);
				let response = await Vue.http.get(setup.API + '/users/list');
				if (response.data.err === 0) {
					console.log(response.data.users);
					store.commit('users', response.data.users);
					return true;
				} else {
					Vue.toast.warning({title:'Warning', message:'Couldn\'t get all the users.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning', message:'Couldn\'t get all the users.<br>Server error: ' + e.status});
				return false;
			}
		},
		async connect(store, data) {
			try {
				let response = await Vue.http.post(setup.API + '/users/connect', data);
				if (response.data.err === 0) {
					return true;
				} else {
					Vue.toast.warning({title:'Warning', message:'Couldn\'t connect to the user.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning', message:'Couldn\'t connect to the user.<br>Server error: ' + e.status});
				return false;
			}
		},
		// async editUser (store, user)
		// {
		// 	try
		// 	{
		// 		let response = await Vue.http.post (setup.API+'/user/edit', user);
		// 		if (response.data.err === 0)
		// 		{
		// 			await store.dispatch ('updateUser');
		// 			return true;
		// 		}
		// 	}
		// 	catch (e)
		// 	{
		// 		// TODO toast network error
		// 		return false;
		// 	}
		// },
		async addUser(store, user) {
			console.log(user);
			try {
				let response = await Vue.http.post(setup.API + '/users/create', user);
				if (response.data.err === 0) {
					await store.dispatch('getAllUsers');
					return true;
				} else {
					Vue.toast.warning({title:'Warning', message:'Couldn\'t add an user.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning', message:'Couldn\'t add an user.<br>Server error: ' + e.status});
				return false;
			}
		},
		async adminUserEdit(store, user) {
			try {
				let response = await Vue.http.post(setup.API + '/users/update', user);
				if (response.data.err === 0) {
					await store.dispatch('getAllUsers');
					return true;
				} else {
					Vue.toast.warning({title:'Warning', message:'Couldn\'t edit the user ADMIN.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning', message:'Couldn\'t edit the user ADMIN.<br>Server error: ' + e.status});
				return false;
			}
		},
		async getUser(store, userId) {
			try {
				let response = await Vue.http.get(setup.API + '/users/get/' + userId);
				if (response.data.err === 0) {
					console.log(response.data.user);
					return response.data.user;
				}
				Vue.toast.warning({title:'Warning', message:'Couldn\'t get the given user.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning', message:'Couldn\'t get the given user.<br>Server error: ' + e.status});
				return false;
			}
		},
		async updateUser (store)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/users/info');
				if (response.data.err === 0)
				{
					store.commit ('user', response.data.user);
					return true;
				}
			}
			catch (e)
			{
				if (e.status === 401)
				{
					store.commit ('user', null);
					store.commit ('token', null);
				} else if (e.status === 0) {
					Vue.toast.connectionError();
					return false;
				} else {
					Vue.toast.warning({title:'Warning!', message:'The token has expired.<br>Server error: ' + e.status});
					store.commit ('user', null);
					store.commit ('token', null);
					return false;
				}
			}
		},
		// async changePassword (store, passwordsData)
		// {
		// 	try
		// 	{
		// 		let response = await Vue.http.post (setup.API+'/user/password/edit', passwordsData);
		// 		if (response.data.err === 0)
		// 		{
		// 			// await store.dispatch ('updateUser');
		// 			return true;
		// 		}
		// 		else
		// 		{
		// 			return false;
		// 		}
		// 	}
		// 	catch (e)
		// 	{
		// 		// TODO toast network error
		// 		return false;
		// 	}
		// }
	},
	mutations: {
		token(state, value) {
			if (value !== null) {
				window.localStorage.setItem(KEY_TOKEN, value);
				state.token = value;
			} else {
				window.localStorage.removeItem(KEY_TOKEN);
				state.token = undefined;
			}
		},
		role(state, value) {
			state.role = value;
		},
		user(state, value) {
			state.user = value;
		},
		userById(state, value) {
			state.userById = value;
		},
		users(state, value) {
			state.users = value;
		}
	}
};