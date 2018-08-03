<template>
	<div>
		<p>Selecteaza un user pentru a-l adauga: </p>
		<div class="dropdown">
			<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				{{displayedUserName}}
			</button>
			<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
				<a class="dropdown-item" v-for="user in filteredUsers" :key="user.userId" 
					href="#" @click="selectUsername(user)">{{user.firstName + ' ' + user.lastName}}</a> 
			</div>
		</div>
	</div>
</template>

<script>

var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'AddStudentToCourseModal',
	props: ['dialog', 'courseId', 'studentIds', 'teacherIds'],
	data () {
		return {
			userName: '',
			userId: null
		};
	},
	methods: {
		selectUsername(user) {
			this.userName = user.firstName + ' ' + user.lastName;
			this.userId = user.userId;
		},

		async getAllUsers () {
			let recvUsers = await this.$store.dispatch ('user/getAllUsers');

			if (!recvUsers)
				console.log('Could not get users...');
		},

		async add ()
		{
			let res = await this.$store.dispatch ('course/addStudentToCourse', {
				courseId: this.courseId,
				studentId: this.userId
			});
			if (res)
				return true;
			else
				return false;
		}
	},
	created() {
		this.getAllUsers ();
		console.log('In add student');
		console.log(this.users);
		console.log(this.studentIds);
	},
	computed: {
		...mapGetters ({
			users: 'user/users'
		}),
		displayedUserName () {
			if (this.userName === '')
				return 'None';
			else 
				return this.userName;
		},
		filteredUsers () {
			return this.users.filter(user => (this.studentIds.includes(user.userId) === false) 
				&& (this.teacherIds.includes(user.userId) === false));
		}
	}
};
</script>