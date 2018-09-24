<template>
	<div class="modal fade myProjectsModal" id="shell" tabindex="-1" role="dialog" aria-labelledby="shell" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">

				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close" data-toggle="tooltip" data-placement="right" title="Close">
						<span aria-hidden="true"><img src="img/close-x-small.png"></span>
					</button>
					<!-- <button type="button" class="resume-proj" data-dismiss="modal" aria-label="Resume project" data-toggle="tooltip" data-placement="bottom" title="Resume project name">
						<span aria-hidden="true"><img src="img/resume.png"></span>
					</button> -->
					<span class="modal-title" id="myProjLabel">Shell</span>
					<div class="pointer"></div>
				</div>
				<div class="modal-body w-100 h-100">
					<Shell v-if="init" :boardId="boardId">
					</Shell>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
var Shell = require ('../modules/Shell.vue');
module.exports = {
	props: ['boardId', 'init'],
	name: 'BoardShell',
	data () {
		return {
			
		};
	},
	async created ()
	{
		
	},
	methods: {
		
	},
	computed: {

	},
	components: {
		Shell
	}
};
</script>
