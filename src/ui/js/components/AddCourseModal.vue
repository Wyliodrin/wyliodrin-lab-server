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
	props: ['dialog'],
	data () {
		return {
			courseName: ''
		};
	},
	methods: {
		async add ()
		{
			let res = await this.$store.dispatch ('course/createCourse', {
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