<template>
	<!-- Aici e tabul cu editat useri -->
	<!-- <div>
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
	</div> -->
	<div class="content w-100 h-100 d-flex flex-column">
			
		<div class="content w-100 d-flex flex-row proj-bar">
			<div class="content-top w-100 pt-2">
				<div class="content-title float-left">
					<span><img src="img/users.png" class="mr-2">Users</span>
					<div class="search"><img src="/img/icons/search-icon.png">
						<input type="text" v-model="search" placeholder="Search" class="search-input">
					</div>
				</div>
				<div class="btn-group submenu">
					<button type="button" class="btn btn-secondary dropdown-toggle xs-submenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img src="img/icons/submenu-icon.png">
					</button>
					<div class="dropdown-menu dropdown-menu-right">
						<button @click="addUser" class="projbar-btn"><img src="img/icons/add-icon-16.png"> New User</button>
					</div>
				</div>
			</div>
		</div>
		<div class="content pt-4 pr-4 pl-4 d-flex flex-column w-100 h-100 rel">
			<div class="d-flex h-100 justify-content-center align-items-center" v-if="users === null">
				<div>
					<half-circle-spinner :animation-duration="1000" :size="120"/>
				</div>
			</div>
			<table v-else class="table table-hover">
				<thead>
					<tr>
						<th scope="col" style="width:70px">
							<a href="#" class="sort-by"></a></th>
						<th scope="col">Name
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Username
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Email
							<a href="#" class="sort-by"></a></th>
							<th scope="col" class="text-center">Role
							<a href="#" class="sort-by"></a></th>
						<!-- <th scope="col" class="text-center">Iterations
							<a href="#" class="sort-by"></a></th> -->
						<!-- <th scope="col" class="text-center" style="width:130px">Actions</th> -->
					</tr>
				</thead>
				<tbody class="users-list">
					<tr v-for="user in filterUsers" :key="user.userId" @click="editUser (user.userId)" class="handpointer">
						<td class="user-pic" style="width:70px"><img :src="gravatar(user, 32)" class="ml-2"></td>
						<td>{{user.firstName+' '+user.lastName}}</td>
						<td class="text-center">{{user.username}}</td>
						<td class="text-center">{{user.email}}</td>
						<td class="text-center">{{user.role}}</td>
						<!-- <td class="text-center">17</td> -->
						<!-- <td class="text-center" style="width:130px"></td> -->
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>

var Vue = require ('vue');
var EditUserModal = require ('./EditUserModal.vue');
var AddUserModal = require ('./AddUserModal.vue');

var mapGetters = require('vuex').mapGetters;

var _ = require ('lodash');
var md5 = require ('md5');

var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;

module.exports = {
	name: 'Users',
	data () {
		return {
			search: ''
		};
	},
	created () {
		this.getAllUsers();
	},
	components: {
		HalfCircleSpinner
	},
	methods: {
		async getAllUsers () {
			let recvUsers = await this.$store.dispatch ('user/getAllUsers');

			if (!recvUsers)
				console.log('Could not get users...');
		},
		editUser (userId) {
			let user = _.find (this.users, function (user){
				return user.userId === userId;
			});
			if (user)
			{
				Vue.bootbox.dialog (EditUserModal, {
					user: user
				}, {
					title: 'Edit user '+user.username,
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
			}
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
		gravatar (user, size)
		{
			// console.log (user);
			return 'https://www.gravatar.com/avatar/'+md5 (user.email)+'?d=mp&s='+size;
		},
	},
	computed: {
		...mapGetters ({
			users: 'user/users',
			user: 'user/user',
		}),
		filterUsers ()
		{
			if (this.search.length > 0)
			{
				let search = this.search.toLowerCase ();
				return _.filter (this.users, function (user)
				{
					console.log (user);
					return user.username.toLowerCase().indexOf (search)>=0 || (user.firstName+' '+user.lastName).toLowerCase().indexOf (search)>=0 || user.email.toLowerCase().indexOf (search)>=0;
				});
			}
			else
			{
				return this.users;
			}
		}
	}
};
</script>

