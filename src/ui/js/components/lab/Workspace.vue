<template>
	<div class="h-100 w-100 app-bg">
		<div v-if="project === null">
			<h3>Welcome to Wylidorin Lab!</h3>
			<ul>
				<li @click="addProject">New project</li>
				<li data-toggle="modal" data-target="#myProjectsModal">Open a project</li>
			</ul>
		</div>
		<div v-else class="h-100 w-100 m-0 p-0 projectbox">
			<div v-if="project!==null">
				<span>{{project.name}}</span>
				<a href="#" @click="settings(project)" class="projsettings" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Project settings"><img src="img/icons/settings-icon-16.png"></a>
				<div class="right">
					<a @click="showDashboard" :class="{'active':source === false}"><img src="img/dashboard.png"> Dashboard</a>
					<a @click="showSource" :class="{'active':source}"><img src="img/code.png"> Code</a>
				</div>
			</div>
			<iframe :src="'/project.html?projectId='+project.projectId" class="h-100 w-100" v-show="source">
			</iframe>
			<iframe id="iframe_freeboard" :src="'/freeboard/freeboard.html?projectId='+project.projectId" class="h-100 w-100" v-show="!source">
			</iframe>
		</div>
	</div>
</template>

<script>
var mapGetters = require ('vuex').mapGetters;
var Vue = require ('vue');
var AddProjectModal = require ('./AddProjectModal.vue');
var SettingsProjectModal = require ('./SettingsProjectModal.vue');
var $ = require ('jquery');
module.exports = {
	name: 'Workspace',
	data () {
		return {
			source: true,
			reloadFreeboard: false
		};
	},
	methods: {
		addProject () {
			Vue.bootbox.dialog (AddProjectModal, {}, {
				title: 'New Project',
				className: 'regularModal',
				buttons:{
					add: {
						label: 'Add',
						className: 'wyliodrin-active'
					},
					back: {
						label: 'Back',
						className: 'wyliodrin-back'
					}
				}
			});
		},

		settings ()
		{
			// Vue.bootbox.dialog (UserSettingsModal, {}, 
			// 	{
			// 		title: 'Settings',
			// 	});
			Vue.bootbox.dialog (SettingsProjectModal, {}, 
				{
					title: 'Settings',
					className: 'regularModal',
					buttons:{
						save: {
							label: 'Save',
							className: 'wyliodrin-active'
						},
						back: {
							label: 'Back',
							className: 'wyliodrin-back'
						}
					}
				});
		},

		showSource ()
		{
			this.source = true;
		},

		showDashboard ()
		{
			this.source = false;
		}
	},
	watch: {
		project ()
		{
			this.showSource ();
			if (this.source) this.reloadFreeboard = true;
			else this.reloadFreeboard = false;
		},
		source ()
		{
			if (this.source === false && this.reloadFreeboard)
			{
				this.reloadFreeboard = false;
				let iframeFreeboard = $('#iframe_freeboard')[0];
				/* eslint no-self-assign: "warn" */
				iframeFreeboard.src = iframeFreeboard.src;
			}
		}
	},
	computed: mapGetters ({
		token: 'user/token',
		WORKSPACE: 'settings/WORKSPACE',
		project: 'project/project'	
	})
};
</script>
