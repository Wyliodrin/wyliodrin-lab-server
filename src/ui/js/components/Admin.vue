<template>
	<div>
		<div class="admin-page">
			<p> Bun venit in pagina de admin </p>

			<div>
				<h2>Tabela de useri</h2>

					<table style="width:100%">
						<tr>
							<th>Username</th>
							<th>First Name</th> 
							<th>Last Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Edit user</th>
						</tr>

						<tr v-for="(item, index) in users" :key="item.userId">
							<td>{{item.username}}</td>
							<td>{{item.firstName}}</td>
							<td>{{item.lastName}}</td>
							<td>{{item.email}}</td>
							<td>{{item.role}}</td>
							<td>
								<button @click="editUser(index)">Edit</button>
							</td>
						</tr>

					</table>
					<p> Adauga un user in baza de date: </p>
					<button @click="addUser">Add</button>
			</div>

			<div>
				<h2>Tabela de cursuri</h2>

			</div>
		</div>
	</div>
</template>

<script>

var Vue = require ('vue');
var EditUserModal = require ('./EditUserModal.vue');
var AddUserModal = require ('./AddUserModal.vue');

var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'Login',
	data() {
		return {
		};
	},
	methods: {
		async getAllUsers () {
			let recvUsers = await this.$store.dispatch ('user/getAllUsers');

			if (!recvUsers)
				console.log('Could not get users...');
		},

		editUser (index) {
			Vue.bootbox.dialog (EditUserModal, {
				'userId': this.users[index].userId,
				'username': this.users[index].username,
				'firstName': this.users[index].firstName,
				'lastName': this.users[index].lastName,
				'email': this.users[index].email,
				'role': this.users[index].role
			}, {
				title: 'Edit user '+this.users[index].username,
				buttons: {
					edit: {
						label: 'Done',
						className: 'wyliodrin-active'
					},
					back: {
						label: 'Cancel',
						className: 'wyliodrin-back'
					}
				}
			});
		},

		addUser () {
			Vue.bootbox.dialog (AddUserModal, {}, {
				title: 'Add user ',
				buttons: {
					add: {
						label: 'Done',
						className: 'wyliodrin-active'
					},
					back: {
						label: 'Cancel',
						className: 'wyliodrin-back'
					}
				}
			});
		},
	},
	created() {
		this.getAllUsers();
	},
	computed: mapGetters ({
		users: 'user/users'
	})
};

</script>