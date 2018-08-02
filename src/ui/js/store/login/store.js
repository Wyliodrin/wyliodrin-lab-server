var Vue = require ('vue');

var VueResource = require ('vue-resource');
Vue.use (VueResource);

var Vuex = require ('vuex');
Vue.use (Vuex);

var user = require ('../modules/user');

module.exports = new Vuex.Store ({
	modules: {
		user
	}
});