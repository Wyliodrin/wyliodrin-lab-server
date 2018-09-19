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
			<div class="projectcode w-80">
				<span>{{project.name}}</span>
				<a href="#" @click="settings(project)" class="projsettings" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Project settings"><img src="img/icons/settings-icon-16.png"></a>
				<div class="right">
					<a @click="showDashboard" :class="{'active':source === false}"><img src="img/dashboard.png"> Dashboard</a>
					<a @click="showSource" :class="{'active':source}"><img src="img/code.png"> Code</a>
				</div>
			</div>
			<div class="h-100 w-80 editor-box">
				<editor v-show="selectedFile" v-model="fileSource" @init="initEditor" lang="python" theme="monokai" :options="editorOptions"></editor>
			</div>
			<div class="tree-box">
				<div class="tree-hide-btn"><i></i></div>
				<tree :options="treeOptions" v-model="selectedNode">
					<span class="tree-container" slot-scope="{ node }" @mouseover="hover (node)" @mouseout="hover(null)">
						<span class="tree-text">
							<template v-if="!node.hasChildren ()">
								<i class="ion-android-document"></i>
								{{ node.text }}
								<div v-if="isHover(node)" class="explorer-actions">
									<a href="#" v-if="node.text!=='(empty)'" @mouseup.stop="renameFile(node)" data-toggle="tooltip" data-placement="left" v-tooltip title="Rename File"><i class="ion-android-create"></i></a>
									<a href="#" v-if="node.text!=='(empty)'" @mouseup.stop="del(node)" data-toggle="tooltip" data-placement="left" v-tooltip title="Delete"><i class="ion-android-close"></i></a>
								</div>
							</template>

							<template v-else>
								<i :class="[node.expanded() ? 'ion-android-folder-open' : 'ion-android-folder']"></i>
								{{ node.text }}
								<div v-if="isHover(node)" class="explorer-actions">
									<a href="#" @mouseup.stop="newFile(node)" data-toggle="tooltip" data-placement="left" v-tooltip title="New File"><i class="ion-android-document"></i></a>
									<a href="#" @mouseup.stop="newFolder(node)" data-toggle="tooltip" data-placement="left" v-tooltip title="New Folder"><i class="ion-android-folder"></i></a>
									<a href="#" v-if="!node.isRoot()" @mouseup.stop="renameFolder(node)" data-toggle="tooltip" data-placement="left" v-tooltip title="Rename Folder"><i class="ion-android-create"></i></a>
									<a href="#" v-if="!node.isRoot()" @mouseup.stop="del(node)" data-toggle="tooltip" data-placement="left" v-tooltip title="Delete Folder"><i class="ion-android-close"></i></a>
								</div>
							</template>
						</span>
					</span>
				</tree>
			</div>
			<!-- <iframe :src="'/ide/ace.html?projectId='+base64ProjectId"  v-show="source">
			</iframe> -->
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
var path = require ('path');
var editor = require ('vue2-ace-editor');
var blockly = require ('blockly/blockly_compressed.js');
console.log (blockly);
module.exports = {
	name: 'Workspace',
	data () {
		return {
			selectedFile: null,
			selectedNode: null,
			hoverNode: null,
			loadedSource: '',
			fileSource: '',
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
			editorOptions: {
				fontSize: '14pt',
			}
		};
	},
	methods: {
		addProject () {
			Vue.bootbox.dialog (AddProjectModal, {}, {
				title: 'New Project',
				className: 'regularModal'
			});
		},

		newFolder (node)
		{
			console.log (this.getPath (node));
			var that = this;
			Vue.bootbox.prompt ({
				title: 'New Folder',
				className: 'regularModal',
				message: 'Enter the new folder\'s name', 
				callback: async function (result) {
					if (result)
					{
						// TODO full path
						if (await that.$store.dispatch ('project/newFolder', {
							project: that.project.name,
							folder: path.join (that.getPath (node), result)
						}))
						{
							that.$store.dispatch ('project/listProjectFolder', that.project.name);
						}
					}
				}
			});
		},

		newFile (node)
		{
			var that = this;
			Vue.bootbox.prompt ({
				title: 'New File',
				className: 'regularModal',
				message: 'Enter the new file\' name', 
				callback: function (result) {
					if (result)
					{
						// TODO full path
						if (that.$store.dispatch ('project/setFile', {
							project: that.project.name,
							file: path.join (that.getPath (node), result),
							data: ''
						}))
						{
							that.$store.dispatch ('project/listProjectFolder', that.project.name);
						}
					}
				}
			});
		},

		renameFile (node)
		{
			var that = this;
			Vue.bootbox.prompt ({
				title: 'Rename',
				className: 'regularModal',
				value: node.text,
				message: 'Enter the new file\'s name',
				callback: function (result) {
					if (result)
					{
						// TODO full path
						that.$store.dispatch ('project/renameFile', {
							project: this.project.name,
							file: this.getPath (node),
							name: path.join (this.getPath(node.parent), result)
						});
					}
				}
			});
		},

		renameFolder (node)
		{
			var that = this;
			Vue.bootbox.prompt ({
				title: 'Rename',
				className: 'regularModal',
				value: node.text,
				message: 'Enter the new folder\'s name',
				callback: function (result) {
					if (result)
					{
						// TODO full path
						that.$store.dispatch ('project/renameFolder', {
							project: this.project.name,
							file: this.getPath (node),
							name: path.join (this.getPath(node.parent), result)
						});
					}
				}
			});
		},

		del (node)
		{
			var that = this;
			Vue.bootbox.confirm ({
				title: 'Delete',
				className: 'regularModal',
				value: node.text,
				message: 'Are you sure you want to delete '+node.text+' ?',
				callback: function (result) {
					if (result)
					{
						// TODO full path
						that.$store.dispatch ('project/del', {
							project: this.project.name,
							file: this.getPath (node),
						});
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
		},

		hover (node)
		{
			// console.log ('hover');
			this.hoverNode = node;
		},

		isHover (node)
		{
			// console.log ('isHover');
			return this.hoverNode === node;
		},
		getPath (node)
		{
			console.log (node);
			if (node.isRoot ()) return '/';
			else return path.join (this.getPath (node.parent), node.data.text);
		},
		isFile (node)
		{
			// console.log (node);
			if (node.data && node.data.type === 'file')
			{
				return true;
			}
			else
			{
				return false;
			}
		},
		initEditor (editor)
		{
			editor;
			require('brace/ext/language_tools'); //language extension prerequsite...
			// require('brace/mode/html');                
			require('brace/mode/python');    //language
			require('brace/mode/less');
			require('brace/theme/monokai');
			require('brace/snippets/python'); //snippet
		},
	},
	watch: {
		project ()
		{
			this.$store.dispatch ('project/listProjectFolder', this.project.name);
			this.showSource ();
			if (this.source) this.reloadFreeboard = true;
			else this.reloadFreeboard = false;
			this.selectedFile = null;
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
		async selectedNode ()
		{
			// console.log (this.selectedNode);
			if (!this.selectedNode[0].hasChildren() && this.selectedNode[0].text !== '(empty)')
			{
				this.selectedFile = this.getPath (this.selectedNode[0]);
				this.loadedSource = '';
				this.fileSource = '';
				let fileData = await this.$store.dispatch ('project/getFile', {
					project: this.project.name,
					file: this.selectedFile
				});
				if (fileData)
				{
					this.loadedSource = new Buffer (fileData, 'base64').toString ();
					this.fileSource = this.loadedSource;
				}
			}
		},
		fileSource ()
		{
			if (this.loadedSource !== this.fileSource)
			{
				this.$store.dispatch ('project/setFile', {
					project: this.project.name,
					file: this.selectedFile,
					data: new Buffer (this.fileSource).toString ('base64')
				});
			}
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
	},
	components: {
		editor
	}
};
</script>
