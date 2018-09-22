<template>
	<div>
		<div class="courseinfo">
		<h1><img src="/img/idea.png">{{NAME}}</h1>
		<span>Plesae sign in and select a course and a board.</span>
		<!-- <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</span> -->
		</div>
		<div class="login-box d-flex align-items-center">
			<div class="triangle"></div>
			<!-- <form action="" method="post" name="Login_Form" class="form-signin"> -->
			<div class="form-signin">
				<center><img src="/img/logo.png" class="m-3"></center>
				<hr class="colorgraph">
				<div v-if="user === null">
					<h5 class="form-signin-heading">Welcome! Please sign in</h5>
				</div>
				<div v-else>
					<h5 class="form-signin-heading">Welcome <strong>{{user.firstName}} {{user.lastName}}</strong>!</h5>
					<button @click="logout" class="changeuser">(change user)</button>
				</div>
				<br>
				<div v-if="working" class="d-flex justify-content-center align-items-center">
					<img src="/img/loading-white.gif">
				</div>
				<div v-else>
					<div v-if="user === null">
						<input type="text" class="form-control" name="Username" placeholder="Username" required="" autofocus="" @keyup.enter="login" v-model="username"/>
						<input type="password" class="form-control" name="Password" placeholder="Password" required="" @keyup.enter="login" v-model="password"/>
						<button class="btn btn-login btn-block" name="Submit" value="Login" @click="login">Sign In</button>
					</div>
					<div v-else-if="user && (!board || !board.courseId)">
						<div v-if="!courses">
							You have no courses assigned, please contact the teacher.
						</div>
						<div v-else class="input-group mb-3" v-show="courses.length>1">
							<div class="input-group-prepend">
								<span class="input-group-text" id="inputGroup-sizing-default">Course</span>
							</div>
							<select name="Course" class="custom-select" v-model="courseId">
								<option v-for="course in courses" :key="course.courseId" :value="course.courseId">{{course.name}}</option>
							</select>
						</div>
						<div class="input-group mb-3">
							<div class="input-group-prepend">
								<span class="input-group-text" id="inputGroup-sizing-default">Board ID</span>
							</div>
							<input type="text" class="form-control bradius" name="BoardId" required="" @keyup.enter="login" v-model="boardId" :readonly="originalBoardId"/>
						</div>
						<button class="btn btn-login btn-block" name="Submit" value="Login" @click="login">Start Lab</button>
					</div>
					<div v-else>
						<div class="input-group mb-3">You are connected to board {{board.boardId}}.<br>
							Please logout first to use another board.</div>
						<button class="btn btn-login btn-block" name="Submit" value="Got to " @click="lab">Start Lab</button>
						<br>
					</div>
					<!-- <button class="btn btn-signup btn-block" value="Create account" @click="createAccount">Create account</button> -->
					<!-- <button class="btn btn-signup btn-block" value="Create account" @click="requestDemo">Request demo account</button> -->
					<!-- <a href="#" class="recoverpass" @click="recoverPassword">Forgot password</a> -->
				</div>
			</div>
			<!-- </form> -->
		</div>
	</div>
</template>

<script>

var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'SignIn',
	data() {
		var urlParams = new URLSearchParams(window.location.search);
		return {
			username: '',
			password: '',
			isAssciated: false,
			courseId: null,
			originalBoardId: urlParams.get ('boardId'),
			boardId: urlParams.get ('boardId')
		};
	},
	methods: {
		async login () {
			if (!this.user)
			{
				let login = await this.$store.dispatch ('user/login', {
					username: this.username,
					password: this.password
				});

				if (login)
				{
					await this.$store.dispatch ('user/updateUser');
					this.username = '';
					this.password = '';
					this.lab ();
				}
				else {
					this.password = '';
				}
			}
			else
			{
				this.lab ();
			}
		},
		async lab ()
		{
			if (this.isAssciated)
			{
				this.$store.dispatch ('settings/redirect', 'LAB');
			}
			else
			if (this.user && this.courseId && this.boardId)
			{
				if (await this.$store.dispatch ('user/connect', {
					boardId: this.boardId,
					courseId: this.courseId
				}))
				{
					this.$store.dispatch ('board/getBoard');
				}
			}

		},
		async logout () {
			await this.$store.dispatch ('user/logout');
			this.$store.dispatch ('user/updateUser');
		},
		async update ()
		{
			let board = this.$store.dispatch ('board/getBoard');
			let course = this.$store.dispatch ('course/listUserCourses');
			await Promise.all ([board, course]);
			if (this.board && this.board.courseId)
			{
				this.isAssciated = true;
			}
		}
	},
	computed: mapGetters ({
		user: 'user/user',
		courses: 'course/userCourses',
		board: 'board/board',
		NAME: 'settings/NAME'
	}),
	created ()
	{
		this.update ();
	},
	watch: {
		user ()
		{
			this.update ();
		},
		courses ()
		{
			if (this.courses && this.courses.length === 1) 
			{
				this.courseId = this.courses[0].courseId;
				this.lab ();
			}
		}
	}
};

</script>