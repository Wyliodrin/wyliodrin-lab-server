<template>
	<span>
		<div>
			<!-- Editare user in tabul de useri -->
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Username</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="userEdit.username">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">First Name</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="userEdit.firstName">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Last Name</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="userEdit.lastName">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Email</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="userEdit.email">
			</div>
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Role</span>
				</div>
				<select name="platform" class="custom-select" v-model="userEdit.role">
					<option v-for="role in ROLES" :key="role.name" :value="role.name">{{role.title}}</option>
				</select>
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
	</span>
</template>

<script>

var mapGetters = require('vuex').mapGetters;
var _ = require ('lodash');

module.exports = {
	name: 'EditUserModal',
	props: ['dialog', 'user'],
	data () {
		return {
			userEdit: _.cloneDeep (this.user),
			inputPassword: '',
			inputRetypePassword: ''
		};
	},
	methods: {
		async edit ()
		{
			console.log (this);
			if (this.inputPassword != this.inputRetypePassword)
				window.alert('Passwords do not match');
			else {
				if (this.inputPassword) {
					this.userEdit.password = this.inputPassword;
				} 

				let newUser = Object.assign({}, this.userEdit);
				console.log(newUser);
				// console.log(this);
				let res = await this.$store.dispatch ('user/adminUserEdit', newUser);
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