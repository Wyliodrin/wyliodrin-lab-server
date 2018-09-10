<template>
	<span>
		<div>
			<!-- Modal de adaugare user in tabul pentru editat useri -->
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Username</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="username">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">First Name</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="firstName">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Last Name</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="lastName">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Email</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="email">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Role</span>
				</div>
				<select name="platform" class="custom-select" v-model="role">
					<option v-for="role in ROLES" :key="role.name" :value="role.name">{{role.title}}</option>
				</select>
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Password</span>
				</div>
				<input type="password" class="form-control" aria-label="Name" v-model="password">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Retype password</span>
				</div>
				<input type="password" class="form-control" aria-label="Name" v-model="retypePassword">
			</div>
		</div>
	</span>
</template>

<script>

var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'AddUserModal',
	props: ['dialog'],
	data () {
		return {
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			role: 'user',
			password: '',
			retypePassword: ''
		};
	},
	methods: {
		async add ()
		{
			console.log (this);
			if (this.inputPassword != this.inputRetypePassword)
				window.alert('Passwords do not match');
			else {
				let res = await this.$store.dispatch ('user/addUser', {
					username: this.username,
					firstName: this.firstName,
					lastName: this.lastName,
					password: this.password,
					email: this.email,
					role: this.role
				});
				if (res)
					return true;
				else
					return false;
			}
		}
	},
	computed: mapGetters ({
		ROLES: 'settings/ROLES'
	})
};
</script>