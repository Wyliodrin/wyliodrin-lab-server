module.exports = {
	namespaced: true,
	state: {
		DASHBOARD: '/views/dashboard.html',
		ADMIN: '/views/admin.html',
		LOGIN: '/views/login.html'
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