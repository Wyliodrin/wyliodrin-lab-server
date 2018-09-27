var Vue = require('vue');
var setup = require('../../setup.js');

// var KEY_TOKEN = 'wyliodrin.token';
// Vue.http.interceptors.push(function(request, next) {
// 	if (window.localStorage.getItem(KEY_TOKEN)) {
// 		request.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem(KEY_TOKEN));
// 	}
// 	next();
// });

module.exports = {
	namespaced: true,
	state: {
		// token: window.localStorage.getItem(KEY_TOKEN),
		course: null,
		courses: null,
		publicCourses: null,
		userCourses: [],
	},
	getters: {
		// token(state) {
		// 	return state.token;
		// },
		course(state) {
			return state.course;
		},
		courses(state) {
			return state.courses;
		},
		publicCourses(state) {
			return state.publicCourses;
		},
		userCourses (state)
		{
			return state.userCourses;
		}
	},
	actions: {
		async listCourses(store) {
			try {
				store.commit('courses', null);
				let response = null;
				if (store.rootGetters['user/user'].role === 'admin')
				{
					response = await Vue.http.get(setup.API + '/courses/all');
				}
				else
				{
					response = await Vue.http.get(setup.API + '/courses/');
				}
				if (response.data.err === 0) {
					// console.log(response.data.courses);
					store.commit('courses', response.data.courses);
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t list all the courses.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list all the courses.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async getCourse(store, courseId) {
			try {
				store.commit('course', null);
				let response = await Vue.http.get(setup.API + '/courses/get/' + courseId);
				if (response.data.err === 0) {
					console.log(response.data.course);
					store.commit('course', response.data.course);
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t get a course.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t get a course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async updateCourse(store) {
			try {
				if (store.state.course)
				{
					let response = await Vue.http.get(setup.API + '/courses/get/' + store.state.course.courseId);
					if (response.data.err === 0) {
						console.log(response.data.course);
						store.commit('course', response.data.course);
						return true;
					} else {
						Vue.toast.warning({title:'Warning!', message:'Couldn\'t update the course.<br>Server error: ' + response.data.err});
						return false;
					}
				}
				else
				{
					Vue.toast.warning({title:'Warning!', message:'The course is not active.'});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t update the course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async listPublicCourses(store) {
			try {
				store.commit('publicCourses', null);
				let response = await Vue.http.get(setup.API + '/courses/public');
				if (response.data.err === 0) {
					console.log(response.data.courses);
					store.commit('publicCourses', response.data.courses);
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the public courses.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the public courses.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async listUserCourses(store) {
			try {
				store.commit('userCourses', []);
				let response = await Vue.http.get(setup.API + '/courses/');
				if (response.data.err === 0) {
					console.log(response.data.courses);
					store.commit('userCourses', response.data.courses);
					return true;
				}
				Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the courses of the given user.<br>Server error: ' + response.data.err});
				return false;
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t list the courses of the given user.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async createCourse(store, courseName) {
			try {
				let response = await Vue.http.post(setup.API + '/courses/add', courseName);
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t create the course.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t create the course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async editCourseName(store, courseUpdateQuery) {
			try {
				let response = await Vue.http.post(setup.API + '/courses/update', courseUpdateQuery);
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					await store.dispatch('getCourse', courseUpdateQuery.courseId);
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t edit the course name.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t edit the course name.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async setImage(store, data) {
			try {
				let response = await Vue.http.post(setup.API + '/courses/image', {
					courseId: data.courseId,
					imageId: data.imageId
				});
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t create the course.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t create the course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async deleteCourse(store, courseId) {
			try {
				let response = await Vue.http.post(setup.API + '/courses/remove', courseId);
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the given course.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the given course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async deleteStudentFromCourse(store, courseUserQuery) {
			try {
				console.log(courseUserQuery);
				let response = await Vue.http.post(setup.API + '/courses/students/remove', courseUserQuery);
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					await store.dispatch('updateCourse', courseUserQuery.courseId);
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the student from the given course.<br>Server error: ' + response.data.err});
					console.log(response);
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the student from the given course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async addStudentToCourse(store, courseUserQuery) {
			try {
				console.log(courseUserQuery);
				let response = await Vue.http.post(setup.API + '/courses/students/add', courseUserQuery);
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					await store.dispatch('updateCourse', courseUserQuery.courseId);
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add a student to the given course.<br>Server error: ' + response.data.err});
					console.log(response);
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add a student to the given course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async deleteTeacherFromCourse(store, courseTeacherQuery) {
			try {
				console.log(courseTeacherQuery);
				let response = await Vue.http.post(setup.API + '/courses/teachers/remove', courseTeacherQuery);
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					await store.dispatch('updateCourse', courseTeacherQuery.courseId);
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the teacher from the given course.<br>Server error: ' + response.data.err});
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t delete the teacher from the given course.<br>Server error: ' + e.body.err});
				return false;
			}
		},

		async addTeacherToCourse(store, courseTeacherQuery) {
			try {
				console.log(courseTeacherQuery);
				let response = await Vue.http.post(setup.API + '/courses/teachers/add', courseTeacherQuery);
				if (response.data.err === 0) {
					await store.dispatch('listCourses');
					await store.dispatch('updateCourse', courseTeacherQuery.courseId);
					return true;
				} else {
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add the teacher to the given course.<br>Server error: ' + response.data.err});
					console.log(response);
					return false;
				}
			} catch (e) {
				if (e.status === 0)
					Vue.toast.connectionError();
				else if (e.status >= 500)
					Vue.toast.warning({title:'Warning!', message:'Couldn\'t add the teacher to the given course.<br>Server error: ' + e.body.err});
				return false;
			}
		}
	},
	mutations: {
		// token(state, value) {
		// 	if (value !== null) {
		// 		window.localStorage.setItem(KEY_TOKEN, value);
		// 		state.token = value;
		// 	} else {
		// 		window.localStorage.removeItem(KEY_TOKEN);
		// 		state.token = undefined;
		// 	}
		// },
		course(state, value) {
			state.course = value;
		},
		courses(state, value) {
			state.courses = value;
		},
		publicCourses(state, value) {
			state.publicCourses = value;
		},
		userCourses (state, value)
		{
			state.userCourses = value;
		}
	}
};