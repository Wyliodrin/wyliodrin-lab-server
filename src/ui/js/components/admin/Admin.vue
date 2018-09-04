<template>
	<div class="content w-100">
		<nav class="navbar navbar-expand-lg navbar-inverse navbar-static-top p-0 w-100 wsd-menu" id="slide-nav">
			<a class="navbar-brand pt-0 pb-0 pl-4" href="index.html"><img src="img/logo.png"></a>
			<button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
				<img src="img/icons/menu-icon.png">
			</button>
			<div class="navbar-toggler hidden-sm-up close-area collapsed" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></div>
			<div class="collapse navbar-collapse no-transition navbar-toggleable-xs" id="navbarResponsive">
				<!-- <div class="nav navbar-nav nav-switch mr-auto" >
					<div class="options-list">
						<a href="/studio.html" data-toggle="tooltip" target="_blank" v-tooltip data-placement="bottom" title="Develop Applications using the Studio" class="switch-app">
							<img src="img/icon-editor.png">
							<span>STUDIO</span>
						</a>
					</div>
				</div> -->
				<div class="nav navbar-nav nav-btns" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false">
					<div style="float: left">
						<!--<div class="run-proj right">
							<a href="#" data-toggle="modal" data-target="#myRunModal">
								<img src="img/run-project.png">
								<span> Run project</span>
								<div class="triangle"></div>
							</a>
						</div>-->
						<div class="main-btn left">
							<router-link to="/" :class="{'active':activeDashboard}" exact>
								<i class="i-dashboard nav-icon"></i>
								<span> Dashboard</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="main-btn left">
							<router-link to="/users" :class="{'active':activeUsers}">
								<i class="i-device nav-icon"></i>
								<span> Users</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="main-btn left">
							<router-link to="/courses" class="menu-last-dist" :class="{'active':activeCourses}">
								<i class="i-product nav-icon"></i>
								<span> Courses</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="main-btn left">
							<router-link to="/raspberrypi" class="menu-last-dist" :class="{'active':activeRaspberryPi}">
								<i class="i-product nav-icon"></i>
								<span> Raspberry Pi</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="main-btn left">
							<router-link href="#" to="/boards" class="menu-last-dist" :class="{'active':activeBoards}">
								<i class="i-product nav-icon"></i>
								<span> Boards</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<!-- <div class="main-btn left">
							<router-link href="#" to="/settings" class="menu-last-dist">
								<i class="i-account nav-icon"></i>
								<span> Settings</span>
								<div class="triangle"></div>
							</router-link>
						</div> -->
					</div>
					<div class="user right connected" style="float: right">
						<a href="#">{{user.name}}</a><span class="user-image">
						<img :src="gravatar"></span>
						<div class="triangle"></div>
						<div class="options-list">
							<!--<a href="#" data-toggle="tooltip" data-placement="bottom" title="Tutorials"><img src="img/icon-tutorial.png"></a>
							<a href="#" data-toggle="tooltip" data-placement="bottom" title="Take the tour"><img src="img/icon-tour.png"></a>
							<a href="#" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Notifications"><img src="img/icon-notification.png">  </a>-->
							<!-- <a href="/docs" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Documentation" target="_blank" class="doc-link"><img src="img/icon-tutorial.png"></a> -->
							<a data-toggle="modal" data-placement="bottom" title="Settings" v-tooltip data-target="#settingsModal" class="settings-link"><img src="img/icon-settings.png"></a>
							<a data-toggle="tooltip" data-placement="bottom" v-tooltip title="Logout" class="logout-link" @click="logout"><img src="img/icon-logoff.png"></a>
						</div>
					</div>
				</div>
			</div>
		</nav>
		<div class="admin-page">
			<!-- <p> Bun venit in pagina de admin </p> -->

			<router-view></router-view>

			
		</div>
	</div>
</template>

<script>

var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'Admin',
	data() {
		return {
			
		};
	},
	methods: {
		async logout ()
		{
			if (await this.$store.dispatch ('user/logout'))
			{
				this.$store.dispatch ('settings/redirect', 'LOGIN');
			}
		},
	},
	created() {
		
	},
	computed: {
		...mapGetters ({
			user: 'user/user',
		})
	}
};

</script>