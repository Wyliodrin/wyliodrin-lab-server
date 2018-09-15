var Vue = require('vue');
var setup = require('../../setup.js');

// var KEY_TOKEN = 'wyliodrin.token';
// Vue.http.interceptors.push(function(request, next) {
// 	if (window.localStorage.getItem(KEY_TOKEN)) {
// 		request.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem(KEY_TOKEN));
// 	}
// 	next();
// });

module.exports = {
	namespaced: true,
	state: {
		// token: window.localStorage.getItem(KEY_TOKEN),
		images: null
	},
	getters: {
		// token(state) {
		// 	return state.token;
		// },
		images(state) {
			return state.images;
		}
	},
	actions: {
		async listImages(store) {
			try {
				// store.commit('images', null);
				let response = await Vue.http.get(setup.API + '/images/list');
				if (response.data.err === 0) {
					console.log(response.data.images);
					store.commit('images', response.data.images);
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the images.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the images.<br>Server error: ' + e.status});
				return false;
			}
		},
		async setup(store, id) {
			try {
				// store.commit('images', null);
				let response = await Vue.http.get(setup.API + '/images/setup/'+id);
				if (response.data.err === 0) {
					// console.log(response.data.images);
					store.dispatch ('listImages');
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t complete the setup.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t complete the setup.<br>Server error: ' + e.status});
				return false;
			}
		},
		async updateImage(store, id) {
			try {
				// store.commit('images', null);
				let response = await Vue.http.get(setup.API + '/images/update/'+id);
				if (response.data.err === 0) {
					// console.log(response.data.images);
					store.dispatch ('listImages');
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t update the image.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t update the image.<br>Server error: ' + e.status});
				return false;
			}
		},
		async deleteImage(store, id) {
			try {
				// store.commit('images', null);
				let response = await Vue.http.get(setup.API + '/images/delete/'+id);
				if (response.data.err === 0) {
					// console.log(response.data.images);
					store.dispatch ('listImages');
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the image.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the image.<br>Server error: ' + e.status});
				return false;
			}
		},
		async download(store, link) {
			try {
				// store.commit('images', null);
				let response = await Vue.http.post(setup.API + '/images/download/', {
					link: link
				});
				if (response.data.err === 0) {
					// console.log(response.data.images);
					store.dispatch ('listImages');
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t download the product.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t download the image.<br>Server error: ' + e.status});
				return false;
			}
		},
	},
	mutations: {
		// token(state, value) {
		// 	if (value !== null) {
		// 		window.localStorage.setItem(KEY_TOKEN, value);
		// 		state.token = value;
		// 	} else {
		// 		window.localStorage.removeItem(KEY_TOKEN);
		// 		state.token = undefined;
		// 	}
		// },
		images(state, value) {
			state.images = value;
		}
	}
};