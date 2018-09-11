<template>
	<div class="d-flex h-100 w-100 flex-column justify-content-center align-items-center">
		<half-circle-spinner
			:animation-duration="1000"
			:size="120"
			color="#e54325"
		/>
		<br>
		<div>Loading project... </div>
		<div v-show="offline">The project workspace is offline, please wait while we start the workspace.</div>
		<div v-show="error">There seems to be a problem while connecting to your project, please try to refresh your workspace from the project menu.</div>
		<div v-show="timeout">There seems to be a problem while connecting to your project, please try refreshing the browser page.</div>
	</div>
</template>

<script>
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;
module.exports = {
	name: 'LoadingProject',
	data () 
	{
		var urlParams = new URLSearchParams(window.location.search);
		return {
			projectId: urlParams.get ('projectId'),
			error: false,
			timeout: false,
			offline: false,
			times: 0
		};
	},
	methods: {
		async tryConnect ()
		{
			try
			{
				await this.$store.dispatch ('settings/init');	
				let response = await this.$store.dispatch ('settings/connectToWorkspace', this.projectId);
				console.log (response);
				if (response === 'online')
				{
					this.$store.dispatch ('settings/workspace', this.projectId);
				}
				else if (response === 'offline')
				{
					if (this.offline === false) this.$store.dispatch ('project/resetWorkspace', this.projectId);
					this.offline = true;
					setTimeout (this.tryConnect, 1000);
				}
				else if (response === 'timeout')
				{
					this.timeout = true;
				}
				else if (response === 'error')
				{
					this.times = this.times + 1;
					if (this.times >= 7)
					{
						this.error = true;
					}
					else
					{
						setTimeout (this.tryConnect, 1000);
					}
				}
			}
			catch (e)
			{
				this.timeout = true;
			}
		}
	},
	components: {
		HalfCircleSpinner
	},
	mounted ()
	{
		this.tryConnect ();
	}
};
</script>

