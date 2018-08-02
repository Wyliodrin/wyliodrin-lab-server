var Vue = require ('vue');

var store = require ('./store/login/store.js');

Vue.mixin({
	store
});

var Login = require ('./components/Login.vue');

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