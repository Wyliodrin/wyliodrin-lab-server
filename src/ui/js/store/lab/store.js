var Vue = require ('vue');

var VueResource = require ('vue-resource');
Vue.use (VueResource);

var Vuex = require ('vuex');
Vue.use (Vuex);

var settings = require ('../modules/settings');

var user = require ('../modules/user');

var course = require ('../modules/course');

var project = require ('../modules/project');

var board = require ('../modules/board');

var socket = require ('../modules/socket');

module.exports = new Vuex.Store ({
	modules: {
		settings,
		user,
		course,
		project,
		board,
		socket
	},
	strict: process.env.NODE_ENV !== 'production'
});