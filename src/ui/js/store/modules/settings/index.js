module.exports = {
	namespaced: true,
	state: {
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
		ROLES (state)
		{
			return state.ROLES;
		}
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