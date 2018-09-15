require('bootstrap');
var Vue = require ('vue');

var toast = require('./vue-toast.js');
Vue.use (toast);

var store = require ('./store/login/store.js');

Vue.mixin({
	store
});

var Login = require ('./components/login/Login.vue');
var Loading = require ('./components/Loading.vue');
// var EditUserModal = require ('./components/EditUserModal.vue');

new Vue({
	el: '#login',
	data: {
		loading: true
	},
	render: function (render) {
		if (this.loading) return render (Loading);
		else 
		{
			return render (Login);
		}
	},
	async created ()
	{
		await this.$store.dispatch ('user/updateUser');
		if (this.$store.getters ['user/token']) 
		{
			this.$store.dispatch ('settings/redirect', 'ADMIN');
		}
		else
		{
			this.loading = false;
		}
	}
});