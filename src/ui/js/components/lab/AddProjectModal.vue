<template>
	<span>
		<div v-show="hasErrors">
			<div class="alert alert-danger" role="alert" v-show="errors.name">
				<span class="error">Please enter the Projects's Name</span>
			</div>
		</div>
		<div class="d-flex h-100 justify-content-center align-items-center" v-if="working">
			<div>
				<img src="/img/loading.gif">
			</div>
		</div>
		<div v-else class="row">
			<div class="input-group col-md-12 mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Name</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="name">
			</div>
			<!-- <div class="input-group col-md-12 mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Platform</span>
				</div>
				<select name="deployer" class="custom-select" v-model="platform">
					<option v-for="(platform,index) in PLATFORM" :key="index" :value="index">{{platform.title}}</option>
				</select>
			</div>
			<div class="input-group col-md-12 mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">UI</span>
				</div>
				<select name="deployer" class="custom-select" v-model="ui">
					<option v-for="(ui,index) in PLATFORM_UI" :key="index" :value="index">{{ui.title}}</option>
				</select>
			</div>
			<div class="input-group col-md-12 mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Language</span>
				</div>
				<select v-model="language" class="custom-select">
					<option v-for="(language, languageId) in LANGUAGES" :key="languageId" :value="languageId">{{language.title}}</option>
				</select>
			</div>
			<div class="input-group col-md-12 mb-3" v-show="hasApplication">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Application</span>
				</div>
				<select name="deployer" class="custom-select" v-model="appId">
					<option value="">(do not assign an application)</option>
					<option v-for="app in applications" :key="app.appId" :value="app.appId">{{app.name}}</option>
				</select>
			</div> -->
			<img src="visual" @click="addVisual" width="100" height="100" alt="Visual">
			<img src="python" @click="addPython" width="100" height="100" alt="Python">
			(pune doua poze fain colorate aici, astea is butoanele pe care apesi sa faci proiectul)
			<!-- <div class="col-md-12 mb-3">
				Language: 
				<select v-model="language">
					<option v-for="language in LANGUAGES" :key="language.name" :value="language.name">{{language.text}}</option>
				</select>
			</div> -->
		</div>
	</span>
</template>

<script>
// var mapGetters = require ('vuex').mapGetters;
// var _ = require ('lodash');
// var $ = require ('jquery');

module.exports = {
	name: 'AddProjectModal',
	props: ['dialog'],
	data () {
		return {
			name: '',
			working: false,
			errors: {}
		};
	},
	methods: {
		verify ()
		{
			this.errors = {};
			if (this.name.trim().length === 0) this.errors.name = true;
		},
		addVisual ()
		{
			this.add ('visual');
		},
		addPython ()
		{
			this.add ('python');
		},
		async add (language)
		{
			if (this.working === false)
			{
				this.verify ();
				if (!this.hasErrors)
				{
					this.working = true;
					let r = await this.$store.dispatch ('project/add', {
						name: this.name.trim (),
						language: language,
					});
					if (r)
					{
						this.dialog.modal ('hide');
					}
					else
					{
						this.working = false;
					}
				}
			}
		}
	},
	created ()
	{
		// this.platform = Object.keys (this.PLATFORM)[0];
		// this.$store.dispatch ('application/list');
	},
	computed: {
		hasErrors ()
		{
			return Object.keys(this.errors).length > 0;
		},
		// ...mapGetters ({
		// 	PLATFORM: 'settings/PLATFORM',
		// 	APPLICATIONS: 'application/applications'
		// }),
		// applications ()
		// {
		// 	var that = this;
		// 	if (_.isArray (this.APPLICATIONS))
		// 	{
		// 		return this.APPLICATIONS.filter (function (app)
		// 		{
		// 			return that.platform === app.platform;
		// 		});
		// 	}
		// 	else 
		// 		return [];
		// },
		// hasApplication ()
		// {
		// 	return this.platform && this.PLATFORM[this.platform].docker.platform !== 'none';
		// }
	},
	watch: {
		// platform ()
		// {
		// 	console.log (this.PLATFORM);
		// 	this.PLATFORM_UI = this.PLATFORM[this.platform].ui;
		// 	if (!this.PLATFORM_UI[this.ui])
		// 	{
		// 		this.ui = Object.keys (this.PLATFORM_UI)[0];
		// 	}
		// 	console.log (this.ui);
		// 	console.log (this.PLATFORM_UI);
		// 	this.LANGUAGES = this.PLATFORM_UI[this.ui].language;
		// 	if (!this.PLATFORM_UI[this.ui].language[this.language])
		// 	{
		// 		console.log (Object.keys (this.PLATFORM_UI[this.ui].language));
		// 		this.language = Object.keys (this.PLATFORM_UI[this.ui].language)[0];
		// 	}
		// }
	}
}; 
</script>

