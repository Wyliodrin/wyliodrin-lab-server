require('bootstrap');
var Vue = require ('vue');

var store = require ('./store/login/store.js');

Vue.mixin({
	store
});

var Login = require ('./components/login/Login.vue');
// var EditUserModal = require ('./components/EditUserModal.vue');

new Vue({
	el: '#login',
	render: function (render) {
		return render (Login, {
		});
	}, 
	components: {
		Login
	}
});