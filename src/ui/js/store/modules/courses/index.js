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
		course: null,
		courses: null
	},
	getters: {
		token (state)
		{
			return state.token;
		},
		course (state)
		{
			return state.course;
		},
		courses (state)
		{
			return state.courses;
		}
	},
	actions: {
		async list_courses (store, credentials)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/courses/list_courses');
				if (response.data.err === 0) {
					console.log (response.data.courses);
					store.commit ('courses', response.data.courses);
					return true;
				}
				return false;
			}
			catch (e)
			{
				console.log ('Login fail '+e);
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
		course (state, value)
		{
			state.course = value;
		},
		courses (state, value)
		{
			state.courses = value;
		}
	}
};