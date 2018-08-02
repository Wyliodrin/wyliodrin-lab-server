var Vue = require ('vue');
var setup = require ('../../setup.js');
var _ = require ('lodash');

module.exports = {
	namespaced: true,
	state: {
		NAME: '',
		LOGIN: '',
		APP: '',
		REPOSITORY: '',
		PLATFORM: [],
		STUDIO: '',
		WORKSPACE: '',
	},
	getters: {
		NAME (state)
		{
			return state.NAME;
		},
		REPOSITORY (state)
		{
			return state.REPOSITORY;
		},
		PLATFORM (state)
		{
			return state.PLATFORM;
		},
		WORKSPACE (state)
		{
			return state.WORKSPACE;
		}
	},
	actions: {
		async init (store)
		{
			let response = await Vue.http.get (setup.API+'/settings');
			console.log (response);	
			store.commit ('init', response.data);
			
			// 	console.error ('Error loading settings '+err);
			// 	// TODO show toast
			// });

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
			if (settings.WORKSPACE.indexOf ('http')!==0) settings.WORKSPACE = location.protocol+'//'+settings.WORKSPACE;
			_.assign (state, settings);
		}
	}
};