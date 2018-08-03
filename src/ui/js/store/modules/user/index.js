var Vue = require ('vue');
var setup = require ('../../setup.js');

var KEY_TOKEN = 'wyliodrin.token';
Vue.http.interceptors.push(function(request, next) {
	if (window.localStorage.getItem (KEY_TOKEN))
	{
		request.headers.set('Authorization', 'Bearer '+window.localStorage.getItem (KEY_TOKEN));
	}
	next();
});

module.exports ={
	namespaced: true,
	state: {
		token: window.localStorage.getItem (KEY_TOKEN),
		role: null,
		user: null,
		userById: null,
		users: null
	},
	getters: {
		token (state)
		{
			return state.token;
		},
		role (state)
		{
			return state.role;
		},
		isLoggedIn (state)
		{
			return state.token && state.token !== '';
		},
		user (state)
		{
			return state.user;
		},
		userById (state)
		{
			return state.userById;
		},
		users (state)
		{
			return state.users;
		}
	},
	actions: {
		async login (store, credentials)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/login', credentials);
				console.log(response.data.role);
				if (response.data.token) {
					store.commit ('token', response.data.token);
					store.commit ('role', response.data.role);
				}
				return true;
			}
			catch (e)
			{
				console.log ('Login fail '+e);
				return false;
			}
		},
		async logout (store)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/user/logout');
				store.commit ('token', null);
				if (response.data.err === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			catch (e)
			{
				console.log ('Logout fail '+e);
				return false;
			}
		},
		async getAllUsers (store)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/admin/list_users');
				if (response.data.err === 0)
				{
					console.log(response.data.users);
					store.commit ('users', response.data.users);
					return true;
				}
				else 
				{
					return false;
				}
			}
			catch (e)
			{
				console.log('Getting all users fail '+e);
				console.log(e);
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
		async addUser (store, user)
		{
			console.log(user);
			try
			{
				let response = await Vue.http.post (setup.API+'/admin/create_user', user);
				if (response.data.err === 0)
				{
					await store.dispatch ('getAllUsers');
					return true;
				} else 
					return false;
			} 
			catch (e) 
			{
				return false;
			}
		},
		async adminUserEdit (store, user)
		{
			try 
			{
				let response = await Vue.http.post (setup.API+'/admin/update_user', user);
				if (response.data.err === 0)
				{
					await store.dispatch ('getAllUsers');
					return true;
				} else 
					return false;
			}
			catch (e)
			{
				return false;
			}
		},
		async getUser (store, userId)
		{
			try
			{
				let response = await Vue.http.get (setup.API +'/admin/get_user/' + userId);
				if (response.data.err === 0) {
					console.log(response.data.user);
					store.commit ('userById', response.data.user);
					return true;
				}
				return false;
			}
			catch (e)
			{
				return false;
			}
		}
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
	mutations: 
	{
		token (state, value)
		{
			if (value !== null)
			{
				window.localStorage.setItem (KEY_TOKEN, value);
				state.token = value;
			}
			else
			{
				window.localStorage.removeItem (KEY_TOKEN);
				state.token = undefined;
			}
		},
		role (state, value)
		{
			state.role = value;
		},
		user (state, value)
		{
			state.user = value;
		},
		userById (state, value)
		{
			state.userById = value;
		},
		users (state, value)
		{
			state.users = value;
		}
	}
};