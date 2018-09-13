<template>
	<div>
		<nav class="navbar navbar-expand-lg navbar-inverse navbar-static-top p-0 w-100" id="slide-nav">
			<a class="navbar-brand pt-0 pb-0 pl-4" href="index.html"><img src="img/logo.png"></a>
			<button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
				<img src="img/icons/menu-icon.png">
			</button>
			<div class="navbar-toggler hidden-sm-up close-area collapsed" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></div>
			<div class="collapse navbar-collapse no-transition navbar-toggleable-xs" id="navbarResponsive">
				<!-- <div class="nav navbar-nav nav-switch mr-auto" >
					<div class="options-list">
						<a href="/app.html" data-toggle="tooltip" target="_blank" v-tooltip data-placement="bottom" title="Deploy Applications in production or beta" class="switch-app">
							<img src="img/icon-deployment.png">
							<span>Scale Deployment</span>
						</a>
					</div>
				</div> -->
				<div class="nav navbar-nav nav-switch mr-auto" ></div>
				<div class="nav navbar-nav nav-btns">
					<div style="float: left">
						<!--<div class="run-proj right">
							<a href="#" data-toggle="modal" data-target="#myRunModal">
								<img src="img/run-project.png">
								<span> Run project</span>
								<div class="triangle"></div>
							</a>
						</div>-->
						<div class="my-boards right">
							<a href="#" data-toggle="modal" data-target="#myRunModal" class="menu-last-dist">
								<img src="img/run-project.png">
								<span> Run</span>
								<div class="triangle"></div>
							</a>
						</div>
						<div class="my-proj right">
							<a href="#" data-toggle="modal" data-target="#myProjectsModal">
								<img src="img/my-projects.png">
								<span> Projects</span>
								<div class="triangle"></div>
							</a>
						</div>
					</div>
					<div class="user right connected" style="float: right">
						<a href="#">{{user.name}}Username</a><span class="user-image">
						<img :src="gravatar"></span>
						<div class="triangle"></div>
						<div class="options-list">
							<a href="/docs" target="_blank" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Documentation" class="doc-link"><img src="img/icon-tutorial.png"></a>
							<!-- <a href="#" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Take the tour"><img src="img/icon-tour.png"></a>
							<a href="#" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Notifications"><img src="img/icon-notification.png">  </a> -->
							<a href="#" data-toggle="modal" data-placement="bottom" v-tooltip title="Settings" data-target="#settingsModal" class="settings-link"><img src="img/icon-settings.png"></a>
							<a data-toggle="tooltip" data-placement="bottom" v-tooltip title="Logout" class="logout-link" @click="logout"><img src="img/icon-logoff.png"></a>
						</div>
					</div>
				</div>
			</div>
		</nav>

		<!--<div class="proj-bar w-100" v-if="project!==null">
			<span>{{project.name}}</span>
			<div class="right">
				<a href="#" @click="settings(project)"><img src="img/proj-settings.png"> Project Settings</a>
				<a href="#"><img src="img/file-manager.png"> File Manager</a>
				<a href="#"><img src="img/dashboard.png"> Dashboard</a>
			</div>
		</div>-->

		<Projects></Projects>
		<!-- <UserSettings></UserSettings> -->
		
		
		<!-- <div class="modal fade myRunModal" id="myRunModal" tabindex="-1" role="dialog" aria-labelledby="myRunModal" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close" data-toggle="tooltip" data-placement="left" title="Close">
							<span aria-hidden="true"><img src="img/close-x-small.png"></span>
						</button>
						<span class="modal-title" id="myRunLabel">Run on board</span>
						<div class="pointer"></div>
					</div>
					<div class="modal-body">
						<a href="#" class="device">
							<div class="row">
								<div class="col-md-8 col-xs-8"><img src="img/raspberrypi-white.png"></div>
								<div class="col-md-4 col-xs-4 device-status text-right">Idle</div>
								<div class="col-md-8 col-xs-8 device-name">My Raspberry board</div>
								<div class="col-md-4 col-xs-4 text-right"><img src="img/device-running.png"></div>
							</div>
						</a>
						<a href="#" class="device device-bg">
							<div class="row">
								<div class="col-md-8 col-xs-8"><img src="img/raspberrypi-white.png"></div>
								<div class="col-md-4 col-xs-4 device-status text-right">Idle</div>
								<div class="col-md-8 col-xs-8 device-name">My Raspberry board</div>
								<div class="col-md-4 col-xs-4 text-right"><img src="img/device-running.png"></div>
							</div>
						</a>
						<a href="#" class="device">
							<div class="row">
								<div class="col-md-8 col-xs-8"><img src="img/raspberrypi-white.png"></div>
								<div class="col-md-4 col-xs-4 device-status text-right">Running</div>
								<div class="col-md-8 col-xs-8 device-name">My Raspberry board</div>
								<div class="col-md-4 col-xs-4 text-right"><img src="img/device-stopped.png"></div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</div> -->
		
		
		
		<!-- <div class="modal fade myRunModal" id="myRunModal" tabindex="-1" role="dialog" aria-labelledby="myRunModal" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close" data-toggle="tooltip" data-placement="right" title="Close">
							<img src="img/close-x-small.png">
						</button>
						<div class="pointer"></div>
						<div class="search">
							<img src="/img/icons/search-icon.png">
							<input type="text" class="search-input" id="search" placeholder="Search" v-model="search">
						</div>
					</div>
					<div class="modal-body" id="scrollstyle">

						<div href="#" class="device" v-for="cluster in clusters" :key="cluster.clusterId" v-show="productsForCluster (cluster.clusterId).length>0 && (!project || cluster.platform === project.platform)">
							<div class="row">
								<div class="col-md-10 col-xs-8">
									<div class="col-md-12">
										<span class="pr-2 device-name">{{cluster.name}}</span>
										<img :src="'img/'+cluster.platform+'-white.png'">
									</div>
								</div>
								
								<div class="col-md-2 col-xs-4 text-right device-add"><a href="#" data-toggle="tooltip" data-placement="top" v-tooltip title="Add device" @click="addProduct (cluster)"><img src="img/icons/add-white-24.png"></a></div>

								<span class="w-100">
									
									<a v-for="product in productsForCluster (cluster.clusterId)" :key="product.productId" data-toggle="tooltip" data-placement="top" v-tooltip :title="product.status" @click="run ($event, product)"><span :class="{'green-color':product.status==='online', 'grey-color':product.status==='off'}">&#8226;</span> {{product.name}}</a>
								</span>
								
								<br>
							</div>
						</div>
					</div>
				
				</div>
			</div>
		</div> -->
		
			<div id="page-content" class="page-content w-100">

			<!--<div style="width: 20%; float: left">
			</div>
			<div style="width: 100%">
			</div>-->
			<Workspace></Workspace>
		</div>
	</div>
</template>

<script>

var Vue = require ('vue');
var Workspace = require ('./Workspace.vue');
var Projects = require ('./Projects.vue');
// var UserSettings = require ('../modules/UserSettings.vue');
// var ProvisionModal = require ('../modules/ProvisionModal.vue');
var mapGetters = require ('vuex').mapGetters;
var md5 = require ('md5');
// var uuid = require ('uuid');
// var $ = require ('jquery');
// var Vue = require ('vue');

module.exports = {
	name: 'Lab',
	data () {
		return {
			
		};
	},
	components: {
		Workspace,
		Projects,
	},
	methods: {
		// addProduct (cluster)
		// {
		// 	Vue.bootbox.dialog (ProvisionModal, {
		// 		cluster: cluster,
		// 		productType: 'development'
		// 	}, {
		// 		title: 'Provision product in '+cluster.name,
		// 		className: 'regularModal',
		// 		buttons: {
		// 			provision: {
		// 				label: 'Provision',
		// 				className: 'wyliodrin-active'
		// 			},
		// 			back: {
		// 				label: 'Back',
		// 				className: 'wyliodrin-back'
		// 			}
		// 		}
		// 	});
		// },
		run (event, product)
		{
			if (this.project)
			{
				console.log ('ctrl '+event.ctrlKey);
				this.$store.dispatch ('settings/runWorkspace', {
					projectId: this.project.projectId,
					productId: product.productId,
					session: this.session,
					reset: event.ctrlKey
				});
				// $('#myRunModal').modal ('hide');
			}
			else
			{
				Vue.bootbox.alert ({
					title: 'Run',
					message: 'Please open a project to run',
					className: 'regularModal',
					buttons: {
						ok: {
							className: 'wyliodrin-active'
						}
					}}
				);
			}
		},
		async logout ()
		{
			if (await this.$store.dispatch ('user/logout'))
			{
				this.$store.dispatch ('settings/redirect', 'LOGIN');
			}
		},
		// productsForCluster (clusterId)
		// {
		// 	let products = [];
		// 	for (let product of this.developmentProducts)
		// 	{
		// 		if (product.clusterId === clusterId && (!this.search || product.name.indexOf (this.search)>=0)) products.push (product);
		// 	}
		// 	return products;
		// }
	},
	computed: {
		...mapGetters ({
			token: 'user/token',
			user: 'user/user',
			project: 'project/project',
			// clusters: 'cluster/clusters',
			// developmentProducts: 'product/developmentProducts'
		}),
		gravatar ()
		{
			return 'https://www.gravatar.com/avatar/'+md5 (this.user.email)+'?d=mp';
		}
	},
	created () {
		// this.$store.dispatch ('cluster/list');
		// this.$store.dispatch ('product/developmentProducts');

		// let that = this;

		// Vue.socket.on ('download', function (data)
		// {
		// 	console.log (data);
		// 	if (that.project && that.project.projectId === data.projectId && this.session === data.session)
		// 	{
		// 		that.$store.dispatch ('settings/download', data);
		// 	}
		// 	else
		// 	{
		// 		console.log ('Not for this project');
		// 	}
		// });
	}
};
</script>s
