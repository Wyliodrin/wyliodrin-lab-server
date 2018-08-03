<template>
	<div>
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="inputGroup-sizing-default">Course name</span>
			</div>
			<input type="text" class="form-control" aria-label="Name" v-model="courseName">
		</div>
	</div>
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