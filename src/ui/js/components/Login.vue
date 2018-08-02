<template>
	<div>
		<div class="login-page">
			<div class="form">
				<!-- <form class="login-form"> -->
					<input type="text" placeholder="username" v-model="username"/>
					<input type="password" placeholder="password" v-model="password"/>
					<button @click="login">login</button>
					<p class="message">Not registered? <a href="#">Create an account</a></p>
				<!-- </form> -->
			</div>
		</div>
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
			await this.$store.dispatch ('user/login', {
				username: this.username,
				password: this.password
			});

			// console.log(this.role);
		}
	},
	computed: mapGetters ({
		role: 'user/role'
	})
};

</script>