module.exports = {
	namespaced: true,
	state: {
		DASHBOARD: '/dashboard.html',
		ADMIN: '/admin.html',
		LOGIN: '/login.html'
	},
	getters: {
	},
	actions: {
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
	}
};