require ('bootstrap');

var Vue = require ('vue');

var bootbox = require ('./../vue-bootbox.js');
Vue.use (bootbox);

// store
var store = require ('./../store/ide/store.js');
Vue.mixin ({
	store
});

var Ace = require ('../components/ide/ace/Ace.vue');

new Vue ({
	el: '#ide',
	data: {
		loading: true
	},

	render: function (render)
	{
		// console.log ('rWelcomeender');\
		return render (Ace);
	}
});
