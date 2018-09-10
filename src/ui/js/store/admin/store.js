var Vue = require ('vue');

var VueResource = require ('vue-resource');
Vue.use (VueResource);

var Vuex = require ('vuex');
Vue.use (Vuex);

var settings = require ('../modules/settings');
var user = require ('../modules/user');
var course = require ('../modules/course');
var image = require ('../modules/image');

module.exports = new Vuex.Store ({
	modules: {
		settings, 
		user,
		image,
		course
	},
	strict: process.env.NODE_ENV !== 'production'
});