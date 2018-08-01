'use strict';

var Vue = require ('vue');
var Login = require ('./components/Login.vue');

new Vue({
	el: '#app',
	render: function (render) {
		// console.log ('render');
		return render (Login, {
		});
	}, 
	components: {
		Login
	}
});