<template>

	<div v-if="user === null">
		Loading
	</div>
	<div class="w-100" v-else>
		<nav class="navbar navbar-expand-lg navbar-inverse navbar-static-top p-0 w-100 welcome-menu" id="slide-nav">
			<a class="navbar-brand pt-0 pb-0 pl-4" href="/admin.html"><img src="img/logo.png"></a>
			<button class="navbar-toggler hidden-sm-up" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
				<img src="img/icons/menu-icon.png">
			</button>
			<div class="navbar-toggler hidden-sm-up close-area collapsed" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></div>
			<div class="collapse navbar-collapse no-transition navbar-toggleable-xs" id="navbarResponsive">
				<div class="nav navbar-nav nav-switch mr-auto" ></div>
				<div class="nav navbar-nav nav-btns">
					<div style="float: left">
						<div class="my-boards left">
							<router-link to="/" :class="{'active':activeDashboard}" exact>
								<img src="img/dashboard-icon.png">
								<span> Dashboard</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="my-boards left">
							<router-link to="/users" :class="{'active':activeUsers}">
								<img src="img/users.png">
								<span> Users</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="my-boards left">
							<router-link to="/courses" :class="{'active':activeCourses}">
								<img src="img/courses.png">
								<span> Courses</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="my-boards left">
							<router-link to="/images" :class="{'active':activeRaspberryPi}">
								<img src="img/raspberrypi.png">
								<span> Images</span>
								<div class="triangle"></div>
							</router-link>
						</div>
						<div class="my-boards left">
							<router-link href="#" to="/boards" class="menu-last-dist" :class="{'active':activeBoards}">
								<img src="img/my-boards.png">
								<span> Boards</span>
								<div class="triangle"></div>
							</router-link>
						</div>
					</div>
					<div class="user right connected" style="float: right">
						<a href="#">{{user.name}}Username</a><span class="user-image">
						<img :src="gravatar"></span>
						<div class="triangle"></div>
						<div class="options-list">
							<!--<a href="#" data-toggle="tooltip" data-placement="bottom" title="Tutorials"><img src="img/icon-tutorial.png"></a>
							<a href="#" data-toggle="tooltip" data-placement="bottom" title="Take the tour"><img src="img/icon-tour.png"></a>
							<a href="#" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Notifications"><img src="img/icon-notification.png">  </a>
							<a href="/docs" data-toggle="tooltip" data-placement="bottom" v-tooltip title="Documentation" target="_blank" class="doc-link"><img src="img/icon-tutorial.png"></a> -->
							<a data-toggle="modal" data-placement="bottom" title="Settings" v-tooltip data-target="#settingsModal" class="settings-link"><img src="img/icon-settings.png"></a>
							<a data-toggle="tooltip" data-placement="bottom" v-tooltip title="Logout" class="logout-link" @click="logout"><img src="img/icon-logoff.png"></a>
						</div>
					</div>
				</div>
			</div>
		</nav>

		<div class="admin-page content greybg w-100 d-flex flex-column h-top">
			<!-- <p> Bun venit in pagina de admin </p> -->

			<router-view></router-view>
		</div>
	</div>

</template>

<script>

var mapGetters = require('vuex').mapGetters;
var md5 = require ('md5');

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
		}
	},
	created() {
		
	},
	computed: {
		...mapGetters ({
			user: 'user/user',
		}),
		gravatar ()
		{
			return 'https://www.gravatar.com/avatar/'+md5 (this.user.email)+'?d=mp';
		}
	}
};

</script>