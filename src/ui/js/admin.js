require('bootstrap');
var Vue = require ('vue');

var toast = require('./vue-toast.js');
Vue.use (toast);

var bootbox = require ('./vue-bootbox.js');
Vue.use (bootbox);

var store = require ('./store/admin/store.js');
Vue.mixin({
	store
});

var Admin = require ('./components/admin/Admin.vue');
var Loading = require ('./components/Loading.vue');

var VueRouter = require ('vue-router');
Vue.use (VueRouter);

var $ = require ('jquery');

Vue.directive ('tooltip', {
	inserted: function (el)
	{
		$(el).tooltip ();
	},
	unbind: function (el)
	{
		// console.log ('unbind');
		$(el).tooltip ('hide');
	}
});

var Dashboard = require ('./components/admin/Dashboard.vue');
var Users = require ('./components/admin/Users.vue');
var Courses = require ('./components/admin/Courses.vue');
var Course = require ('./components/admin/Course.vue');
var Setup = require ('./components/admin/Setup.vue');
var Boards = require ('./components/admin/Boards.vue');
var Images = require ('./components/admin/Images.vue');

var router = new VueRouter ({
	routes: [
		{
			path: '/',
			component: Dashboard
		},
		{
			path: '/users',
			component: Users
		},
		{
			path: '/courses',
			component: Courses
		},
		{
			path: '/courses/:courseId',
			component: Course
		},
		{
			path: '/images',
			component: Images
		},
		{
			path: '/boards',
			component: Boards
		},
		{
			path: '/setup',
			component: Setup
		},
	]
}
);

new Vue({
	el: '#admin',
	data: {
		loading: true
	},
	router,
	render: function (render) {
		if (this.loading) return render (Loading);
		else return render (Admin, {
		});
	}, 
	async created ()
	{
		await this.$store.dispatch ('user/updateUser');
		if (!this.$store.getters ['user/token']) 
		{
			this.$store.dispatch ('settings/redirect', 'LOGIN');
		}
		else
		{
			this.loading = false;
			// Vue.socket.connect (this.$store.getters ['user/token']);
		}
	}
});