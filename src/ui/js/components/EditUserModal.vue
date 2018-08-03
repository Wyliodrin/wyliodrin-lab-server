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
			<input type="text" class="form-control" aria-label="Name" v-model="username">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Email</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="email">
		</div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Name</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="name">
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
</template>

<script>
module.exports = {
	name: 'EditUserModal',
	props: ['dialog'],
	data () {
		return {
			username: '',
			name: '',
			email: '',
			password: '',
			retypePassword: '',
			working: false
		};
	},
	methods: {
		edit ()
		{
			if (!this.working)
			{
				// console.log (this);
				// let res = await this.$store.dispatch ('user/signup', {
				// 	username: this.username,
				// 	name: this.name,
				// 	email: this.email,
				// 	password: this.password
				// });
				// if (res)
				// {
				// 	return true;
				// }
				// else
				// {
				// 	this.working = false;
				// 	return false;
				// }
				console.log('yes');
				return true;
			}
			return false;
		}
	}
};
</script>