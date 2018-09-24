var Vue = require ('vue');

module.exports = {
	namespaced: true,
	state: {
		status: 'disconnected'
	},
	getters: {
		status (state)
		{
			return state.status;
		},
	},
	actions: {
		connect (store)
		{
			let getToken = function ()
			{
				return store.rootGetters['user/token'];
			};
			Vue.socket.connect (getToken);
			Vue.socket.on ('status', function (data)
			{
				store.commit ('status', data.status);
			});
		},
		disconnect ()
		{
			Vue.socket.disconnect ();
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
		status (state, status)
		{
			state.status = status;
		}
	}
};