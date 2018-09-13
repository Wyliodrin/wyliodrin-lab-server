<template>
	<div class="modal fade myProjectsModal" id="myProjectsModal" tabindex="-1" role="dialog" aria-labelledby="myProjectsModal" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" data-toggle="tooltip" data-placement="right" title="Close">
						<span aria-hidden="true"><img src="img/close-x-small.png"></span>
					</button>
					<!-- <button type="button" class="resume-proj" data-dismiss="modal" aria-label="Resume project" data-toggle="tooltip" data-placement="bottom" title="Resume project name">
						<span aria-hidden="true"><img src="img/resume.png"></span>
					</button> -->
					<span class="modal-title" id="myProjLabel">Projects</span>
					<div class="pointer"></div>
				</div>
				<div class="modal-body">
					<div v-if="projects === null" class="d-flex h-100 w-100 justify-content-center align-items-center">
						<half-circle-spinner
							:animation-duration="1000"
							:size="120"
							color="#e54325"
						/>
					</div> 
					<div v-else class="projects-container">
						<button @click="addProject" type="button" class="new-proj" data-dismiss="modal" aria-label="New project" data-toggle="tooltip"  v-tooltip data-placement="top" title="New project">
							<span aria-hidden="true"><img src="img/new-device.png"></span>
						</button>
						<div class="projSection myProjects-section">
							<div class="projSection-top row">

								<ul id="projectslist" class="row projects">
								
									<li @click.self="load (project)" class="proj-box" v-for="project in projects" :key="project.projectId">
										<a class="" @click="load (project)">
											<span class="language" :class="'lang-'+project.language"></span>
										</a>
										<div class="btn-group proj-settings">
											<a class="dropdown-toggle" data-toggle="dropdown" href="#">
												<span>Settings</span>
												<span class="myicon myicon-settings-black"></span>
											</a>
											<div class="dropdown-menu">
												<!-- <a href="#" class="dropdown-item cloneProject">Clone</a>
												<a href="#" class="dropdown-item renameProject">Rename</a>
												<a href="#" class="dropdown-item downloadProject">Download application</a>
												<div class="dropdown-divider"></div> -->
												<a href="#" class="dropdown-item downloadProject" @click="resetWorkspace(project);">Reset workspace</a>
												<div class="dropdown-divider"></div>
												<a href="#" @click="removeProject (project)" class="dropdown-item remove">Remove</a>
											</div>
										</div>
										<a class="name " @click="load (project)">{{project.name}}</a>
									</li>
								</ul>

							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
var Vue = require ('vue');
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;
var mapGetters = require ('vuex').mapGetters;
var AddProjectModal = require ('./AddProjectModal.vue');
var $ = require ('jquery');
module.exports = {
	name: 'Projects',
	data () {
		return {
			
		};
	},
	created ()
	{
		this.$store.dispatch ('project/list');
	},
	methods: {
		menu ()
		{
			
		},
		addProject () {
			Vue.bootbox.dialog (AddProjectModal, {}, {
				title: 'New Project',
				className: 'regularModal',
				// buttons:{
				// 	add: {
				// 		label: 'Add',
				// 		className: 'wyliodrin-active'
				// 	},
				// 	back: {
				// 		label: 'Back',
				// 		className: 'wyliodrin-back'
				// 	}
				// }
			});
		},
		resetWorkspace (project)
		{
			var that = this;
			Vue.bootbox.confirm ({
				title: 'Reset '+project.name+'?',
				message: 'This action is not undoable, all project workspace settings will be deleted.',
				className: 'regularModal',
				buttons:
				{
					confirm: {
						label: 'Yes',
						className: 'wyliodrin-active'
					},
					cancel: {
						label: 'No',
						className: 'wyliodrin-back'
					}
				},
				callback: function (result)
				{
					if (result)
					{
						that.$store.dispatch ('project/resetWorkspace', project.projectId);
						if (this.project && this.project.projectId === project.projectId)
						{
							this.$store.commit ('project/project', null);
						}
					}
				}
			});
		},
		load (project)
		{
			this.$store.commit ('project/project', project);
			$(this.$el).modal ('hide');
			return true;
		},
		removeProject (project)
		{
			var that = this;
			Vue.bootbox.confirm ({
				title: 'Are you sure you want to remove '+project.name+'?',
				message: 'This action is not undoable, all project files will be removed.',
				className: 'regularModal',
				buttons:
				{
					confirm: {
						label: 'Yes',
						className: 'wyliodrin-active'
					},
					cancel: {
						label: 'No',
						className: 'wyliodrin-back'
					}
				},
				callback: function (result)
				{
					if (result)
					{
						that.$store.dispatch ('project/del', project.projectId);
					}
				}
			});
		}
	},
	computed: mapGetters ({
		projects: 'project/projects'
	}),
	components: {
		HalfCircleSpinner
	}
};
</script>
