<template>
	<span>
		<div>
			<div class="input-group mb-3">
				<!--  Editare nume curs in tabul de cursuri -->
				<div class="input-group-prepend">
					<span class="input-group-text" id="inputGroup-sizing-default">Course name</span>
				</div>
				<input type="text" class="form-control" aria-label="Name" v-model="courseName">
			</div>
		</div>
	</span>
</template>

<script>

// var mapGetters = require('vuex').mapGetters;

module.exports = {
	name: 'AddCourseModal',
	props: ['dialog', 'courseId'],
	data () {
		return {
			courseName: ''
		};
	},
	methods: {
		async edit ()
		{
			let res = await this.$store.dispatch ('course/editCourseName', {
				courseId: this.courseId,
				name: this.courseName
			});
			if (res)
				return true;
			else
				return false;
		}
	}
};
</script>