(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }
  
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

},{}],2:[function(require,module,exports){
;(function(){
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'Login',
	data() {
		return {
			username: '',
			password: ''
		};
	},
	methods: {
		async login () {
			await this.$store.dispatch ('user/login', {
				username: this.username,
				password: this.password
			});

			// console.log(this.role);
		}
	},
	computed: mapGetters ({
		role: 'user/role'
	})
};


})()
if (module.exports.__esModule) module.exports = module.exports.default
var __vue__options__ = (typeof module.exports === "function"? module.exports.options: module.exports)
if (__vue__options__.functional) {console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions.")}
__vue__options__.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{staticClass:"login-page"},[_c('div',{staticClass:"form"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.username),expression:"username"}],attrs:{"type":"text","placeholder":"username"},domProps:{"value":(_vm.username)},on:{"input":function($event){if($event.target.composing){ return; }_vm.username=$event.target.value}}}),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.password),expression:"password"}],attrs:{"type":"password","placeholder":"password"},domProps:{"value":(_vm.password)},on:{"input":function($event){if($event.target.composing){ return; }_vm.password=$event.target.value}}}),_vm._v(" "),_c('button',{on:{"click":_vm.login}},[_vm._v("login")]),_vm._v(" "),_vm._m(0)])])])}
__vue__options__.staticRenderFns = [function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',{staticClass:"message"},[_vm._v("Not registered? "),_c('a',{attrs:{"href":"#"}},[_vm._v("Create an account")])])}]
if (module.hot) {(function () {  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), true)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-24b7e225", __vue__options__)
  } else {
    hotAPI.reload("data-v-24b7e225", __vue__options__)
  }
})()}
},{"vue":"vue","vue-hot-reload-api":1,"vuex":"vuex"}],3:[function(require,module,exports){
var Vue = require ('vue');

var store = require ('./store/login/store.js');

Vue.mixin({
	store
});

var Login = require ('./components/Login.vue');

new Vue({
	el: '#login',
	render: function (render) {
		return render (Login, {
		});
	}, 
	components: {
		Login
	}
});
},{"./components/Login.vue":2,"./store/login/store.js":4,"vue":"vue"}],4:[function(require,module,exports){
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
},{"../modules/user":5,"vue":"vue","vue-resource":"vue-resource","vuex":"vuex"}],5:[function(require,module,exports){
var Vue = require ('vue');
var setup = require ('../../setup.js');

var KEY_TOKEN = 'wyliodrin.token';
Vue.http.interceptors.push(function(request, next) {
	if (window.localStorage.getItem (KEY_TOKEN))
	{
		request.headers.set('Authorization', 'Bearer '+window.localStorage.getItem (KEY_TOKEN));
	}
	next();
});

module.exports ={
	namespaced: true,
	state: {
		token: window.localStorage.getItem (KEY_TOKEN),
		role: null,
		user: null,
		sessions: null,
		storage: null,
	},
	getters: {
		token (state)
		{
			return state.token;
		},
		role (state)
		{
			return state.role;
		},
		isLoggedIn (state)
		{
			return state.token && state.token !== '';
		},
		user (state)
		{
			return state.user;
		},
		sessions (state)
		{
			return state.sessions;
		},
		storage (state)
		{
			return state.storage;
		}
	},
	actions: {
		async login (store, credentials)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/login', credentials);
				console.log(response.data.role);
				if (response.data.token) {
					store.commit ('token', response.data.token);
					store.commit ('role', response.data.role);
				}
				return true;
			}
			catch (e)
			{
				console.log ('Login fail '+e);
				return false;
			}
		},
		async signup (store, user)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/create', user);
				if (response.data.err === 0) return true;
				else return false;
			}
			catch (e)
			{
				console.log ('Error signup '+e);
				return false;
				// TODO show toast
			}
		},
		async logout (store)
		{
			try
			{
				let response = await Vue.http.get (setup.API+'/user/logout');
				store.commit ('token', null);
				if (response.data.err === 0)
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			catch (e)
			{
				console.log ('Logout fail '+e);
				return false;
			}
		},
		async logoutTokenId (store, tokenId)
		{
			try
			{
				store.commit ('sessions', null);
				let response = await Vue.http.get (setup.API+'/user/logout/'+tokenId);
				if (response.data.err === 0)
				{
					store.dispatch ('sessions');
					return true;
				}
				else
				{
					return false;
				}
			}
			catch (e)
			{
				console.log ('Logout for ' + tokenId + ' fail '+e);
				return false;
			}
		},
		async editUser (store, user)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/edit', user);
				if (response.data.err === 0)
				{
					await store.dispatch ('updateUser');
					return true;
				}
			}
			catch (e)
			{
				// TODO toast network error
				return false;
			}
		},
		async changePassword (store, passwordsData)
		{
			try
			{
				let response = await Vue.http.post (setup.API+'/user/password/edit', passwordsData);
				if (response.data.err === 0)
				{
					// await store.dispatch ('updateUser');
					return true;
				}
				else
				{
					return false;
				}
			}
			catch (e)
			{
				// TODO toast network error
				return false;
			}
		}
	},
	mutations: 
	{
		token (state, value)
		{
			if (value !== null)
			{
				window.localStorage.setItem (KEY_TOKEN, value);
				state.token = value;
			}
			else
			{
				window.localStorage.removeItem (KEY_TOKEN);
				state.token = undefined;
			}
		},
		role (state, value)
		{
			state.role = value;
		},
		user (state, value)
		{
			state.user = value;
		},
		sessions (state, value)
		{
			state.sessions = value;
		},
		storage (state, value)
		{
			state.storage = value;
		},
	}
};
},{"../../setup.js":6,"vue":"vue"}],6:[function(require,module,exports){
module.exports = {
	API: '/api/v1'
};
},{}]},{},[3]);
