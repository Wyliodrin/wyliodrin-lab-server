<template>
	<div>
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
				<input type="text" class="form-control" aria-label="Name" v-model="project.name">
			</div>
			<div class="input-group col-md-12 mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Language</span>
				</div>
				<select v-model="project.language" class="custom-select">
					<option v-for="(language, languageId) in LANGUAGES" :key="languageId" :value="languageId">{{language.title}}</option>
				</select>
			</div>
			<div class="input-group col-md-12 mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Platform</span>
				</div>
				<select name="deployer" class="custom-select" v-model="project.platform">
					<option v-for="(platform,index) in PLATFORM" :key="index" :value="index">{{platform.title}}</option>
				</select>
			</div>
			<div class="input-group col-md-12 mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">UI</span>
				</div>
				<select name="deployer" class="custom-select" v-model="project.ui">
					<option v-for="(ui,index) in PLATFORM_UI" :key="index" :value="index">{{ui.title}}</option>
				</select>
			</div>
			<div class="input-group col-md-12 mb-3" v-show="hasApplication">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Application</span>
				</div>
				<select name="deployer" class="custom-select" v-model="project.appId">
					<option :value="'local.'+project.projectId">(do not assign an application)</option>
					<option v-for="app in applications" :key="app.appId" :value="app.appId">{{app.name}}</option>
				</select>
			</div>
			<!-- <div class="col-md-12 mb-3">
				Language: 
				<select v-model="language">
					<option v-for="language in languages" :key="language.name" :value="language.name">{{language.text}}</option>
				</select>
			</div> -->
		</div>
	</div>
</template>

<script>
var _ = require ('lodash');
var mapGetters = require ('vuex').mapGetters;

module.exports = {
	name: 'SettingsProjectModal',
	data () {
		return {
			project: _.cloneDeep (this.$store.getters['project/project']),
			working: false,
			LANGUAGES: {},
			PLATFORM_UI: {},
			errors: {}
		};
	},
	methods: {
		verify ()
		{
			this.errors = {};
			if (this.project.name.trim().length === 0) this.errors.name = true;
		},
		async save ()
		{
			if (this.working === false)
			{
				this.verify ();
				if (!this.hasErrors)
				{
					this.working = true;
					let r = await this.$store.dispatch ('project/save', this.project);
					if (r)
					{
						return true;
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
		// this.$store.dispatch ('project/languages');
		this.$store.dispatch ('application/list');
		this.PLATFORM_UI = this.PLATFORM[this.project.platform].ui;
		this.LANGUAGES = this.PLATFORM_UI[this.project.ui].language;
	},
	computed: {
		hasErrors ()
		{
			return Object.keys(this.errors).length > 0;
		},
		...mapGetters ({
			APPLICATIONS: 'application/applications',
			PLATFORM: 'settings/PLATFORM',
		}),
		applications ()
		{
			var that = this;
			if (_.isArray (this.APPLICATIONS))
			{
				return this.APPLICATIONS.filter (function (app)
				{
					return that.project.platform === app.platform;
				});
			}
			else 
				return [];
		},
		hasApplication ()
		{
			return this.project.platform && this.PLATFORM[this.project.platform].docker.platform !== 'none';
		}
	},
	watch: {
		'project.platform' ()
		{
			console.log (this.project.platform);
			this.PLATFORM_UI = this.PLATFORM[this.project.platform].ui;
			if (!this.PLATFORM_UI[this.project.ui])
			{
				this.ui = Object.keys (this.PLATFORM_UI)[0];
			}
			this.LANGUAGES = this.PLATFORM_UI[this.project.ui].language;
			if (!this.PLATFORM_UI[this.project.ui].language[this.project.language])
			{
				console.log (Object.keys (this.PLATFORM_UI[this.project.ui].language));
				this.project.language = Object.keys (this.PLATFORM_UI[this.project.ui].language)[0];
			}
		}
	}
};
</script>

