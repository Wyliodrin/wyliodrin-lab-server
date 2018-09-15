require ('bootstrap');

var Vue = require ('vue');

var toast = require('./vue-toast.js');
Vue.use (toast);

var $ = require ('jquery');

var bootbox = require ('./vue-bootbox.js');
Vue.use (bootbox);

// var socket = require ('./vue-socket.js');
// Vue.use (socket);

// store
var store = require ('./store/lab/store.js');
Vue.mixin ({
	store
});

var Loading = require ('./components/Loading.vue');
var Lab = require ('./components/lab/Lab.vue');
var SignIn = require ('./components/lab/SignIn.vue');

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

var mapGetters = require('vuex').mapGetters;

new Vue ({
	el: '#lab',
	data: {
		loading: true
	},

	render: function (render)
	{
		// console.log ('render');\
		if (this.loading) return render (Loading);
		else if (this.user && this.board && this.board.boardId && this.board.courseId)
		{
			return render (Lab);
		}
		else
		{
			return render (SignIn);
		}

	},

	async created ()
	{
		// await this.$store.dispatch ('settings/init');	
		await this.$store.dispatch ('user/updateUser');
		await this.$store.dispatch ('board/getBoard');
		this.loading = false;
		// if (!this.$store.getters ['user/token']) 
		// {
		// 	this.$store.dispatch ('settings/redirect', 'LOGIN');
		// }
		// else
		// {
		// 	this.loading = false;
		// 	Vue.socket.connect (this.$store.getters ['user/token']);
		// }
	},
	
	computed: {
		...mapGetters ({
			user: 'user/user',
			board: 'board/board'
		})
	}
});
