<template>
	<!-- Aici e tabul cu editat useri -->
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
</template>

<script>

var Vue = require ('vue');
var EditUserModal = require ('./EditUserModal.vue');
var AddUserModal = require ('./AddUserModal.vue');

var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'Users',
	created () {
		this.getAllUsers();
	},
	methods: {
		async getAllUsers () {
			let recvUsers = await this.$store.dispatch ('user/getAllUsers');

			if (!recvUsers)
				console.log('Could not get users...');
		},
		editUser (index) {
			Vue.bootbox.dialog (EditUserModal, {
				user: this.users[index]
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

		async getUserById(userId) {
			let recvUser = await this.$store.dispatch ('user/getUser', userId);

			console.log(recvUser.firstName);

			if (recvUser)
				return recvUser.firstName;
			else
				return null;
		},
	},
	computed: {
		...mapGetters ({
			users: 'user/users',
			user: 'user/user',
		})
	}
};
</script>

