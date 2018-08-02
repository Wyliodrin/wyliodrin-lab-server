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
		sessions: null,
		storage: null,
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
		sessions (state)
		{
			return state.sessions;
		},
		storage (state)
		{
			return state.storage;
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
		async signup (store, user)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/create', user);
				if (response.data.err === 0) return true;
				else return false;
			}
			catch (e)
			{
				console.log ('Error signup '+e);
				return false;
				// TODO show toast
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
		async logoutTokenId (store, tokenId)
		{
			try
			{
				store.commit ('sessions', null);
				let response = await Vue.http.get (setup.API+'/user/logout/'+tokenId);
				if (response.data.err === 0)
				{
					store.dispatch ('sessions');
					return true;
				}
				else
				{
					return false;
				}
			}
			catch (e)
			{
				console.log ('Logout for ' + tokenId + ' fail '+e);
				return false;
			}
		},
		async editUser (store, user)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/edit', user);
				if (response.data.err === 0)
				{
					await store.dispatch ('updateUser');
					return true;
				}
			}
			catch (e)
			{
				// TODO toast network error
				return false;
			}
		},
		async changePassword (store, passwordsData)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/password/edit', passwordsData);
				if (response.data.err === 0)
				{
					// await store.dispatch ('updateUser');
					return true;
				}
				else
				{
					return false;
				}
			}
			catch (e)
			{
				// TODO toast network error
				return false;
			}
		}
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
		sessions (state, value)
		{
			state.sessions = value;
		},
		storage (state, value)
		{
			state.storage = value;
		},
	}
};