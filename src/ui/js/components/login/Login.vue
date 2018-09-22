<template>
	<div>
		<div class="courseinfo">
		<h1><img src="/img/idea.png">{{NAME}} Admin</h1>
		<span>This section if for administration only</span>
		<!-- <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</span> -->
		</div>
		<div class="login-box d-flex align-items-center">
			<div class="triangle"></div>
			<!-- <form action="" method="post" name="Login_Form" class="form-signin"> -->
			<div class="form-signin">
				<center><img src="/img/logo.png" class="m-3"></center>
				<hr class="colorgraph">
				<h5 class="form-signin-heading">Administration Sign In</h5>
				<br>
				
				<div class="d-flex h-100 justify-content-center align-items-center" v-if="waitingForLogin">
				<div>
					<half-circle-spinner :animation-duration="1000" :size="120"/>
				</div>
				</div>


				<div v-else id="abc" >

					<input type="text" class="form-control" name="Username" placeholder="Username" required="" autofocus="" @keyup.enter="login" v-model="username"/>
					<input type="password" class="form-control" name="Password" placeholder="Password" required="" @keyup.enter="login" v-model="password"/>
					<button class="btn btn-login btn-block" name="Submit" value="Login"  @click="login"  >Login</button>
					
					<!-- <button class="btn btn-signup btn-block" value="Create account" @click="createAccount">Create account</button> -->
					<!-- <button class="btn btn-signup btn-block" value="Create account" @click="requestDemo">Request demo account</button> -->
					<!-- <a href="#" class="recoverpass" @click="recoverPassword">Forgot password</a> -->
				</div>
			</div>
			<!-- </form> -->
		</div>
	</div>
</template>

<script>

var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;
var mapGetters = require('vuex').mapGetters;


module.exports = {
	name: 'Login',
	data() {
		return {
			username: '',
			password: '',
			waitingForLogin : false
		};
	},
	components: {
		HalfCircleSpinner
	},
	methods: {
		async login () {	

			this.waitingForLogin = true;

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
				this.waitingForLogin = false;
				// this.username = '';
				this.password = '';
			}
		}
	},
	computed: mapGetters ({
		NAME: 'settings/NAME',
		role: 'user/role'
	})
};

</script>