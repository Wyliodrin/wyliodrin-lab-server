<template>
	<div class="content w-100 h-100 d-flex flex-column">
			
		<div class="content w-100 d-flex flex-row proj-bar">
			<div class="content-top w-100 pt-2">
				<div class="content-title float-left">
					<span><img src="img/users.png" class="mr-2">Boards</span>
					<div class="search"><img src="/img/icons/search-icon.png">
						<input type="text" v-model="search" placeholder="Search" class="search-input">
					</div>
				</div>
				<div class="btn-group submenu">
					<button type="button" class="btn btn-secondary dropdown-toggle xs-submenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img src="img/icons/submenu-icon.png">
					</button>
					<!-- <div class="dropdown-menu dropdown-menu-right">
						<button @click="addUser" class="projbar-btn"><img src="img/icons/add-icon-16.png"> New User</button>
					</div> -->
				</div>
			</div>
		</div>
		<div class="content pt-4 pr-4 pl-4 d-flex flex-column w-100 h-100 rel">
			<div class="d-flex h-100 justify-content-center align-items-center" v-if="boards === null">
				<div>
					<half-circle-spinner :animation-duration="1000" :size="120"/>
				</div>
			</div>
			<table v-else class="table table-hover">
				<thead>
					<tr>
						<th scope="col">Board ID
							<a href="#" class="sort-by"></a></th>
						<!-- <th scope="col">User
							<a href="#" class="sort-by"></a></th> -->
						<th scope="col" class="text-center">Username
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Course
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">IP
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Status
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Last Seen
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Actions
							<a href="#" class="sort-by"></a></th>
						<!-- <th scope="col" class="text-center">Iterations
							<a href="#" class="sort-by"></a></th> -->
						<!-- <th scope="col" class="text-center" style="width:130px">Actions</th> -->
					</tr>
				</thead>
				<tbody>
					<tr v-for="board in boards" :key="board.boardId">
						<td>{{board.boardId}}</td>
						<td class="text-center">{{user(board.userId)}}</td>
						<td class="text-center">{{course(board.courseId)}}</td>
						<td class="text-center">{{board.ip}}</td>
						<td class="text-center">{{board.status}}</td>
						<td class="text-center">{{lastSeen (board)}}</td>
						<!-- <td class="text-center">17</td> -->
						<td class="text-center" style="width:130px">
							<a class="iconbtn" @click="reboot(board)" v-tooltip data-toggle="tooltip"  data-placement="top" title="Reboot"><img src="/img/icons/restart-16.png"></a>
							<a class="iconbtn" @click="disconnect(board)" v-tooltip data-toggle="tooltip" data-placement="top" title="Disconnect"><img src="/img/icons/disconnect-16.png"></a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;

var mapGetters = require('vuex').mapGetters;
var Vue = require ('vue');
var moment = require ('moment');
var timeout = null;
var _ = require ('lodash');
module.exports = {
	name: 'Boards',
	components: {
		HalfCircleSpinner
	},
	computed: {
		...mapGetters ({
			users: 'user/users',
			courses: 'course/courses',
			boards: 'board/boards'
		})
	},
	created ()
	{
		this.updateBoards ();
		this.$store.dispatch ('user/getAllUsers');
		this.$store.dispatch ('course/listCourses');
		// this.$store.dispatch ('board/listBoards');
	},
	destroyed ()
	{
		clearTimeout (timeout);
	},
	methods: {
		reboot (board)
		{
			board;
		},
		disconnect (board)
		{
			var that = this;
			Vue.bootbox.confirm ('Are you sure you want to disconnect?', function (result)
			{
				if (result)
				{
					that.$store.dispatch ('board/disconnect', board.boardId);
				}
			});
		},
		lastSeen (board)
		{
			// console.log (deployment);
			// console.log (product.latestStatus);
			if (board.lastInfo)
			{
				return new moment (board.lastInfo).format ('MMMM Do YYYY, h:mm:ss a');
			}
			else
			{
				return 'never';
			}
		},
		async updateBoards ()
		{
			await this.$store.dispatch ('board/listBoards');
			timeout = setTimeout (this.updateBoards, 5000);
		},
		user (userId)
		{
			if (this.users)
			{
				let user = _.find (this.users, function (user)
				{
					if (user.userId === userId) return true;
				});
				if (user)
				{
					return user.firstName+' '+user.lastName;
				}
				else
				{
					return userId;
				}
			}
			else
			{
				return userId;
			}
		},
		course (courseId)
		{
			if (this.courses)
			{
				let course = _.find (this.courses, function (course)
				{
					if (course.courseId === courseId) return true;
				});
				if (course)
				{
					return course.name;
				}
				else
				{
					return courseId;
				}
			}
			else
			{
				return courseId;
			}
		}
	}
};
</script>

