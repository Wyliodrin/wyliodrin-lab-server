var Vue = require ('vue');
var setup = require ('../../setup.js');
var _ = require ('lodash');

module.exports = {
	namespaced: true,
	state: {
		NAME: 'Wyliodrin Lab',
		DASHBOARD: '/dashboard.html',
		ADMIN: '/admin.html',
		LOGIN: '/login.html',
		LAB: '/lab.html',
		ROLES: [
			{
				name: 'user',
				title: 'User'
			},
			{
				name: 'admin',
				title: 'Administrator'
			}
		]
	},
	getters: {
		NAME (state)
		{
			return state.NAME;
		},
		ROLES (state)
		{
			return state.ROLES;
		}
	},
	actions: {
		async init (store)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/settings');
				console.log (response);	
				store.commit ('init', response.data);
				
				// 	console.error ('Error loading settings '+err);
				// 	// TODO show toast
				// });
			}
			catch (e)
			{
				store.dispatch ('redirect', 'ERROR');
			}
		},
		redirect (store, application)
		{
			let address = store.state[application];
			console.log (address);
			if (address !== '' && address !== undefined && address !== null)
			{
				console.log ('Redirect to '+address);
				window.location.href = address;
			}
		}
	},
	mutations: {
		init (state, settings)
		{
			// if (settings.WORKSPACE.indexOf ('http')!==0) settings.WORKSPACE = location.protocol+'//'+settings.WORKSPACE;
			_.assign (state, settings);
		}
	}
};