require('bootstrap');
var Vue = require ('vue');

var bootbox = require ('./vue-bootbox.js');
Vue.use (bootbox);

var store = require ('./store/admin/store.js');
Vue.mixin({
	store
});

var Admin = require ('./components/admin/Admin.vue');

new Vue({
	el: '#admin',
	render: function (render) {
		return render (Admin, {
		});
	}, 
	components: {
		Admin
	}
});