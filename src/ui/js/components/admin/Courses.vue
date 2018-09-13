<template>
	<!-- Asta e tabul de cursuri, in care sunt editate cursuri -->
	<!--<div>

		<table style="width:100%">
			<tr>
				<th>Name</th>
				<th>Students</th> 
				<th>Teachers</th>
				<th>Edit course</th>
			</tr>

			<tr v-if="courseIndex !== null">
				<td>{{course.name}}</td>
				<td>
					<ul class="list-group">
						<li class="list-group-item" v-for="(student, index) in course.students" :key="index">
								{{student.firstName + ' ' + student.lastName}}
								<button @click="deleteStudentFromCourse(student.userId)">X</button>
						</li>
					</ul>
					<button @click="addNewStudent">Add new student</button>
				</td>
				<td>
					<ul class="list-group">
						<li class="list-group-item" v-for="(teacher, index) in course.teachers" :key="index">
								{{teacher.firstName + ' ' + teacher.lastName}}
								<button @click="deleteTeacherFromCourse(teacher.userId)">X</button>
						</li>
					</ul>
					<button @click="addNewTeacher">Add new teacher</button>
				</td>
				<td>
					<button @click="editCourseName(course.courseId)">Edit Name</button>
					<button @click="deleteCourse(course.courseId)">Delete</button>
				</td>
			</tr>
		</table>

		<button @click="addCourse">Add new course</button>
	</div>-->
	<div class="content w-100 h-100 d-flex flex-column">
			
		<div class="content w-100 d-flex flex-row proj-bar">
			<div class="content-top w-100 pt-2">
				<div class="content-title float-left">
					<span><img src="img/courses.png" class="mr-2">Courses</span>
				</div>
				<div class="btn-group submenu">
					<button type="button" class="btn btn-secondary dropdown-toggle xs-submenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img src="img/icons/submenu-icon.png">
					</button>
					<div class="dropdown-menu dropdown-menu-right">
						<button @click="addCourse" class="projbar-btn"><img src="img/icons/add-icon-16.png"> New Course</button>
					</div>
				</div>
			</div>
		</div>
		<div class="content pt-4 pr-4 pl-4 d-flex flex-column w-100 h-100 rel">
			<div class="d-flex h-100 justify-content-center align-items-center" v-if="courses === null">
				<div>
					<half-circle-spinner :animation-duration="1000" :size="120"/>
				</div>
			</div>
			<table v-else class="table courses-table table-hover">
				<!-- <thead>
					<tr>
						<th scope="col">Course
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Students
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Teachers
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center">Iterations
							<a href="#" class="sort-by"></a></th>
						<th scope="col" class="text-center" style="width:130px">Actions</th>
					</tr>
				</thead> -->
				<tbody>
					<tr v-for="course in courses" :key="course.name" @click="linkCourse (course.courseId)" class="handpointer col-lg-2 col-md-3 col-sm-4 c-science">
						<td class="course-name"><h5>{{course.name}}</h5></td>
						<td class="course-std-nbr"><img src="img/students-group.png"> {{course.students.length}}</td>
						<!-- <td class="text-center">{{latestVersion(application)}}</td> -->
						<!-- <td class="text-center">17</td>
						<td class="text-center" style="width:130px"><router-link :to="'/courses/'+course.courseId" class="iconbtn" v-tooltip data-toggle="tooltip" data-placement="top" title="View details"><img src="img/icons/view-16.png"></router-link></td> -->
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
var Vue = require ('vue');
var AddCourseModal = require ('./AddCourseModal.vue');
var EditCourseNameModal = require ('./EditCourseNameModal.vue');
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;

var mapGetters = require('vuex').mapGetters;
module.exports = {
	name: 'Courses',
	data () {
		return {
			courseIndex: null
		};
	},
	components: {
		HalfCircleSpinner
	},
	methods: {
		async getAllCourses () {
			let recvCourses = await this.$store.dispatch ('course/listCourses');

			if (!recvCourses)
				console.log('Could not get courses...');
		},

		async selectCourse (index) {
			let recvCourse = await this.$store.dispatch ('course/getCourse', this.courses[index].courseId);
			this.courseIndex = index;
			if (!recvCourse)
				console.log('Could not get courses...');
		},

		addCourse () {
			Vue.bootbox.dialog (AddCourseModal, {}, {
				title: 'Add course',
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

		editCourseName () {
			Vue.bootbox.dialog (EditCourseNameModal, {
				courseId: this.course.courseId
			}, {
				title: 'Edit course name',
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

		async deleteCourse (courseId) {
			console.log(courseId);
			this.courseIndex = null;
			let recvDelete = await this.$store.dispatch ('course/deleteCourse',{
				courseId: courseId
			});

			if (!recvDelete)
				console.log('Could not delete course...');
		},

		linkCourse (cousreId)
		{
			this.$router.push ('/courses/'+cousreId);
		},
	},
	created () {
		this.getAllCourses();
		console.log(this.courses);
	},
	computed: {
		...mapGetters ({
			courses: 'course/courses',
			course: 'course/course'
		}),
		courseName () {
			if (this.courseIndex === null)
				return 'Niciun curs selectat';
			else
				return this.course.name;
		}
	}
};
</script>

