require ('bootstrap');

var Vue = require ('vue');

var toast = require('./vue-toast.js');
Vue.use (toast);

var $ = require ('jquery');

var bootbox = require ('./vue-bootbox.js');
Vue.use (bootbox);

// socket
var socket = require ('./vue-socket.js');
Vue.use (socket);

// store
var store = require ('./store/lab/store.js');
Vue.mixin ({
	store
});

var LiquorTree = require ('liquor-tree');
Vue.use(LiquorTree);

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
var urlParams = new URLSearchParams(window.location.search);
let boardId = urlParams.get ('boardId');

new Vue ({
	el: '#lab',
	data: {
		loading: true
	},

	render: function (render)
	{
		// console.log ('render');\
		if (this.loading) return render (Loading);
		else if (this.user && this.board && this.board.boardId && (!boardId || this.board.boardId === boardId) && this.board.courseId)
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
		await this.$store.dispatch ('settings/init');	
		await this.$store.dispatch ('user/updateUser');
		await this.$store.dispatch ('board/getBoard');
		this.loading = false;
		console.log ('token '+this.token);
		if (this.token) this.connectSocket ();
	},
	
	computed: {
		...mapGetters ({
			user: 'user/user',
			token: 'user/token',
			board: 'board/board',
		})
	},

	watch: {
		token ()
		{
			// console.log ('token');
			if (this.token !== undefined) this.connectSocket ();
		}
	},

	methods: {
		connectSocket ()
		{
			Vue.socket.connect (this.token);
		}
	}
});