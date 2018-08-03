<template>
	<div>
		<div class="d-flex h-100 justify-content-center align-items-center" v-if="working === null">
			<div>
				<img src="/img/loading.gif">
			</div>
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Username</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="inputUsername">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">First Name</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="inputFirstName">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Last Name</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="inputLastName">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Email</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="inputEmail">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Role</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="inputRole">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Password</span>
			</div>
			<input type="password" class="form-control" aria-label="Name" v-model="inputPassword">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Retype password</span>
			</div>
			<input type="password" class="form-control" aria-label="Name" v-model="inputRetypePassword">
		</div>
	</div>
</template>

<script>

// var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'EditUserModal',
	props: ['dialog', 'userId', 'username', 'firstName', 'lastName', 'email', 'role'],
	data () {
		return {
			inputUsername: this.username,
			inputFirstName: this.firstName,
			inputLastName: this.lastName,
			inputEmail: this.email,
			inputRole: this.role,
			inputPassword: '',
			inputRetypePassword: '',
			working: false
		};
	},
	methods: {
		async edit ()
		{
			if (!this.working)
			{
				console.log (this);
				if (this.inputPassword != this.inputRetypePassword)
					window.alert('Passwords do not match');
				else {
					let toBeModifiedUser = {
						username: this.inputUsername,
						firstName: this.inputFirstName,
						lastName: this.inputLastName,
						email: this.inputEmail,
						role: this.inputRole,
						password: this.inputPassword
					};
					let newUser = Object.assign({}, toBeModifiedUser);
					console.log(newUser);
					// console.log(this);
					let res = await this.$store.dispatch ('user/adminUserEdit', newUser);
					if (res)
						return true;
					else
						return false;
				}
			}
			return false;
		}
	}
};
</script>