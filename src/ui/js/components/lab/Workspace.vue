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
			<div>
				<span>{{project.name}}</span>
				<a href="#" @click="settings(project)" class="projsettings" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Project settings"><img src="img/icons/settings-icon-16.png"></a>
				<div class="right">
					<a @click="showDashboard" :class="{'active':source === false}"><img src="img/dashboard.png"> Dashboard</a>
					<a @click="showSource" :class="{'active':source}"><img src="img/code.png"> Code</a>
				</div>
			</div>
			<div style="height: 100%; width: 20%; float: left;">
				<tree :options="treeOptions" v-model="selectedFile">
					<span class="tree-text" slot-scope="{ node }">
						<template v-if="!node.hasChildren()">
							<i class="ion-android-document"></i>
							{{ node.text }}
						</template>

						<template v-else>
							<i :class="[node.expanded() ? 'ion-android-folder-open' : 'ion-android-folder']"></i>
							{{ node.text }}
							<div v-if="node.selected()"><a href="" @click="newFile">New File</a><a href="" @click="newFolder">New Folder</a></div>
						</template>
					</span>
				</tree>
			</div>
			<iframe :src="'/ide/ace.html?projectId='+base64ProjectId" class="h-100 w-80" v-show="source">
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
			selectedFile: null,
			source: true,
			reloadFreeboard: false,
			treeOptions: {
				store: {
					store: this.$store,
					getter: 'project/projectFolder'
				},
				propertyNames: {
					'text':'name',
					'children':'files'
				}
			},
		};
	},
	methods: {
		addProject () {
			Vue.bootbox.dialog (AddProjectModal, {}, {
				title: 'New Project',
				className: 'regularModal'
			});
		},

		newFolder ()
		{
			var that = this;
			Vue.bootbox.prompt ('New Folder Name', function (result) {
				if (result)
				{
					// TODO full path
					that.$store.dispatch ('project/newFolder', {
						project: this.project.name,
						folder: result 
					});
				}
			});
		},

		newFile ()
		{
			var that = this;
			Vue.bootbox.prompt ('New File Name', function (result) {
				if (result)
				{
					// TODO full path
					that.$store.dispatch ('project/newFile', {
						project: this.project.name,
						file: result 
					});
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
			this.$store.dispatch ('project/listProjectFolder', this.project.name);
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
		},
		selectedFile ()
		{
			console.log (this.selectedFile);
		}
	},
	computed: 
	{
		...mapGetters ({
			token: 'user/token',
			WORKSPACE: 'settings/WORKSPACE',
			project: 'project/project'	,
		}),
		base64ProjectId ()
		{
			console.log (this.project);
			if (this.project)
			{
				return new Buffer (this.project.name).toString ('base64');
			}
			else
			{
				return null;
			}
		}
	}
};
</script>
