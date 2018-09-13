<template>
	<span>
		<div>
			<!-- Modalul pentru adaugarea unui student la un curs in tabul de editare curs -->
			<p>Selecteaza un user pentru a-l adauga: </p>
			<input type="text" v-model="search">
			<br>
			<div class="content greybg w-100 d-flex flex-column" v-if="users === null">
				<div class="d-flex h-100 justify-content-center align-items-center">
					<div>
						<half-circle-spinner :animation-duration="1000" :size="120"/>
					</div>
				</div>
			</div>
			<table border="1" v-else>
				<tr>
					<th>Name</th>
					<th>Username</th>
					<th>Actions</th>
				</tr>
				<tr v-for="user in filteredUsers" :key="user.userId">
					<td>{{user.firstName+' '+user.lastName}}</td>
					<td>{{user.username}}</td>
					<td>
						<a v-tooltip data-toggle="tooltip" data-placement="top" title="Add Student" @click="add(user)"><img src="img/icons/add.png"></a>
					</td>
				</tr>
			</table>
			<!-- <div class="dropdown">
				<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					{{displayedUserName}}
				</button>
				<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<a class="dropdown-item"  
						href="#" @click="selectUsername(user)">{{user.firstName + ' ' + user.lastName}}</a> 
				</div>
			</div> -->
		</div>
	</span>
</template>

<script>

var mapGetters = require('vuex').mapGetters;
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;

module.exports = {
	name: 'AddStudentToCourseModal',
	props: ['dialog'],
	data () {
		return {
			userName: '',
			userId: null
		};
	},
	components: {
		HalfCircleSpinner
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

		async add (user)
		{
			let res = await this.$store.dispatch ('course/addStudentToCourse', {
				courseId: this.course.courseId,
				studentId: user.userId
			});
			if (res)
				await this.$store.dispatch ('course/updateCourse');
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
			users: 'user/users',
			course: 'course/course',
		}),
		displayedUserName () {
			if (this.userName === '')
				return 'None';
			else 
				return this.userName;
		},
		filteredUsers () {
			return this.users.filter(user => (this.course.students.includes(user.userId) === false) 
				&& (this.course.teachers.includes(user.userId) === false));
		}
	}
};
</script>