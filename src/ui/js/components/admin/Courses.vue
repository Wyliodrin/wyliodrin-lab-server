<template>
	<!-- Asta e tabul de cursuri, in care sunt editate cursuri -->
	<div>
		<h2>Lista de cursuri</h2>
		
		<p>Selecteaza un curs: </p>
		<div class="dropdown">
			<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				{{courseName}}
			</button>
			<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
				<a class="dropdown-item" v-for="(item, index) in courses" :key="item.courseId" 
					@click="selectCourse(index)" href="#">{{item.name}}</a> <!-- Aici e posibil :-? -->
			</div>
		</div>

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
	</div>
</template>

<script>
var Vue = require ('vue');
var AddCourseModal = require ('./AddCourseModal.vue');
var AddStudentToCourseModal = require ('./AddStudentToCourseModal.vue');
var AddTeacherToCourseModal = require ('./AddTeacherToCourseModal.vue');
var EditCourseNameModal = require ('./EditCourseNameModal.vue');

var mapGetters = require('vuex').mapGetters;
module.exports = {
	name: 'Courses',
	data () {
		return {
			courseIndex: null
		};
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

		

		addNewStudent () {
			Vue.bootbox.dialog (AddStudentToCourseModal, {
				courseId: this.course.courseId,
				studentIds: this.course.students.map(student => student.userId),
				teacherIds: this.course.teachers.map(teacher => teacher.userId)
			}, {
				title: 'Add new Student',
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

		async deleteStudentFromCourse(studentId){
			let courseId = this.course.courseId;

			console.log(studentId);
			console.log(courseId);

			let recvDelStudent = await this.$store.dispatch ('course/deleteStudentFromCourse', {
				courseId: courseId,
				studentId: studentId
			});

			if (!recvDelStudent)
				console.log('Could not delete student from course..');
		},

		addNewTeacher () {
			Vue.bootbox.dialog (AddTeacherToCourseModal, {
				courseId: this.course.courseId,
				studentIds: this.course.students.map(student => student.userId),
				teacherIds: this.course.teachers.map(teacher => teacher.userId)
			}, {
				title: 'Add new Teacher',
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

		async deleteTeacherFromCourse(teacherId){
			let courseId = this.course.courseId;

			let recvDelTeacher = await this.$store.dispatch ('course/deleteTeacherFromCourse', {
				courseId: courseId,
				teacherId: teacherId
			});

			if (!recvDelTeacher)
				console.log('Could not delete teacher from course..');
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

