<template>
	<div class="login-box d-flex align-items-center">
		<!-- <form action="" method="post" name="Login_Form" class="form-signin"> -->
		<div class="form-signin">
			<center><img src="/img/logo.png" class="m-3"></center>
			<hr class="colorgraph">
			<h5 class="form-signin-heading">Welcome! Please sign in</h5>
			<br>
			<div v-if="working" class="d-flex justify-content-center align-items-center">
				<img src="/img/loading-white.gif">
			</div>
			<div v-else>
				<input type="text" class="form-control" name="Username" placeholder="Username" required="" autofocus="" @keyup.enter="login" v-model="username"/>
				<input type="password" class="form-control" name="Password" placeholder="Password" required="" @keyup.enter="login" v-model="password"/>
				<button class="btn btn-login btn-block" name="Submit" value="Login" @click="login">Login</button>
				<!-- <button class="btn btn-signup btn-block" value="Create account" @click="createAccount">Create account</button> -->
				<button class="btn btn-signup btn-block" value="Create account" @click="requestDemo">Request demo account</button>
				<a href="#" class="recoverpass" @click="recoverPassword">Forgot password</a>
			</div>
		</div>
		<!-- </form> -->
	</div>
</template>

<script>

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
			let login = await this.$store.dispatch ('user/login', {
				username: this.username,
				password: this.password
			});

			if (login)
			{
				if (this.role === 'admin')
				{
					this.$store.dispatch ('settings/redirect', 'ADMIN');
				}
				else
				{
					this.$store.dispatch ('settings/redirect', 'LAB');
				}
			}
			else {
				this.username = '';
				this.password = '';
			}
		}
	},
	computed: mapGetters ({
		role: 'user/role'
	})
};

</script>