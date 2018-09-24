<template>
	<div class="w-100 h-100">
		<div v-show="starter" class="d-flex h-100 justify-content-center align-items-center" v-if="starter">
			<div>
				<half-circle-spinner :animation-duration="1000" :size="60"/>
			</div>
		</div>
	</div>
</template>

<script>

var $ = require ('jquery');
var shells = {};
var xterm = require ('xterm');
var fit = require ('xterm/lib/addons/fit/fit');
var Vue = require ('vue');
xterm.Terminal.applyAddon (fit);
var HalfCircleSpinner = require ('epic-spinners/dist/lib/epic-spinners.min.js').HalfCircleSpinner;
var Shell = require ('../modules/Shell.vue');

$(window).resize (function ()
{
	for (let shellId in shells)
	{
		let shellData = shells[shellId];
		let shell = shellData.shell;
		if (shell)
		{
			shell.fit ();
			Vue.socket.send ('s', {
				id: shellId,
				a: 'r',
				c: shell.cols,
				r: shell.rows
			});
		}
		else
		{
			console.error ('Shell '+shellId+' has no active shell');
		}
	}
});

function executeShell (data)
{
	if (data.l === 's' || (data.l === 'b' && (data.t === 's' || data.t === 'r')))
	{
		if (data.id)
		{
			let id = data.id;
			if (data.t === 'r') id = id+':run';
			let shellData = shells [id];
			if (shellData)
			{
				let shell = shellData.shell;
				if (data.a === 'e')
				{
					if (data.err === 'noshell' && data.t !== 'r')
					{
						console.log ({
							t: data.t,
							id: data.id,
							pid: data.pid,
							a: 'o',
							c: shell.cols,
							r: shell.rows
						});
						Vue.socket.send (data.l, {
							t: data.t,
							id: data.id,
							pid: data.pid,
							a: 'o',
							c: shell.cols,
							r: shell.rows
						});			
					}
				}
				else
				if (data.a === 'k')
				{
					shell.write (data.k);
				}
				if (data.a === 'c')
				{
					shellData.vue.$emit ('run', false);
				}
				else
				if (data.a === 's')
				{
					shellData.vue.$emit ('run', data.s);
				}
			}
			else
			{
				console.error ('Shell data with id '+id+' does not exist');
			}
		}
		else
		{
			console.error ('Shell data without id received');
		}
	}
}

Vue.socket.on ('s', executeShell);
Vue.socket.on ('r', executeShell);
Vue.socket.on ('b', executeShell);

module.exports = {
	name: 'Shell',
	props: ['courseId', 'boardId', 'projectId', 'runId'],
	data ()
	{
		return {
			shell: null,
			starter: true,
		};
	},
	mounted () {
		let that = this;
		setTimeout (function ()
		{
			that.start ();
			// Vue.socket.on ('packet:'+productId, packet);
			// Vue.socket.send ('packet', productId, {
			// 	t: 's',
			// 	d: {
			// 		a:'r',
			// 		r: shell.rows,
			// 		c: shell.cols
			// 	}
			// });
			// shell.on ('data', function (data)
			// {
			// 	Vue.socket.send ('packet', productId, {
			// 		t: 's',
			// 		d: {
			// 			a:'k',
			// 			t:data
			// 		}
			// 	});
			// });
		}, 1000);
	},
	components: {
		HalfCircleSpinner,
		Shell,
	},
	computed: {
		l ()
		{
			if (this.courseId) return 's';
			else return 'b';
		},
		id ()
		{
			if (this.courseId) return this.courseId;
			else return this.boardId;
		},
		t ()
		{
			if (this.projectId) return 'r';
			else return 's';
		},
		shellId ()
		{
			if (this.projectId) return this.id+':run';
			else return this.id;
		}
	},
	methods: {
		start ()
		{
			this.starter = false;
			this.exit ();
			let shell = new xterm.Terminal ();
			this.shell = shell;
			shells[this.shellId] = {
				shell: shell,
				vue: this
			};
			console.log (this.$el);
			shell.open (this.$el);
			shell.fit ();
			if (!this.projectId) shell.write ('Press any key to start a shell\r\n');
			var that = this;
			shell.on ('data', function (data)
			{
				Vue.socket.send (that.l, {
					t: that.t,
					id: that.id,
					pid: that.projectId,
					a:'k',
					k:data
				});
			});
			if (this.projectId)
			{
				Vue.socket.send ('b', {
					t: 'r',
					a: 's',
					id: this.id
				});
			}
		},
		exit (id)
		{
			if (!id) id = this.shellId;
			if (shells[id]) shells[id].shell.destroy ();
			delete shells[id];
			this.shell = null;
			// Vue.socket.removeListener ('packet:'+productId, packet);
			// shell.destroy ();
			return true;
		},
	},
	watch:
	{
		runId ()
		{
			if (this.projectId && this.boardId)
			{
				if (this.runId !== null)
				{
					this.$emit ('run', true);
					this.shell.clear ();
					Vue.socket.send ('b', {
						t: 'r',
						id: this.boardId,
						pid: this.projectId,
						a: 'o',
						c: this.shell.cols,
						r: this.shell.rows
					});	
				}
				else
				{
					Vue.socket.send ('b', {
						t: 'r',
						id: this.boardId,
						pid: this.projectId,
						a: 'c',
						c: this.shell.cols,
						r: this.shell.rows
					});	
				}
			}
		},
		projectId (newValue, oldValue)
		{
			this.exit (oldValue);
			this.start ();
		}
	},
	destroyed ()
	{
		// Vue.socket.removeListener ('packet:'+productId, packet);
		this.exit ();
	}
};
</script>

