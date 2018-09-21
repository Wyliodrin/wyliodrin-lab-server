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
	if (data.l === 's' || (data.l === 'b' && data.t === 's'))
	{
		if (data.id)
		{
			let shellData = shells [data.id];
			if (shellData)
			{
				let shell = shellData.shell;
				if (data.a === 'e')
				{
					if (data.err === 'noshell')
					{
						console.log ({
							t: 's',
							id: data.id,
							a: 'o',
							c: shell.cols,
							r: shell.rows
						});
						Vue.socket.send (data.l, {
							t: 's',
							id: data.id,
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
			}
			else
			{
				console.error ('Shell data with id '+data.id+' does not exist');
			}
		}
		else
		{
			console.error ('Shell data without id received');
		}
	}
}

Vue.socket.on ('s', executeShell);
Vue.socket.on ('b', executeShell);

module.exports = {
	name: 'Shell',
	props: ['courseId', 'boardId'],
	data ()
	{
		return {
			starter: true
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
		HalfCircleSpinner
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
		}
	},
	methods: {
		start ()
		{
			this.starter = false;
			this.exit ();
			let shell = new xterm.Terminal ();
			shells[this.id] = {
				shell
			};
			shell.open (this.$el);
			// shell.fit ();
			shell.write ('Press any key to start a shell\r\n');
			var that = this;
			shell.on ('data', function (data)
			{
				Vue.socket.send (that.l, {
					t: 's',
					id: that.id,
					a:'k',
					k:data
				});
			});
		},
		exit ()
		{
			if (shells[this.id]) shells[this.id].shell.destroy ();
			delete shells[this.id];
			// Vue.socket.removeListener ('packet:'+productId, packet);
			// shell.destroy ();
			return true;
		},
	},
	destroyed ()
	{
		// Vue.socket.removeListener ('packet:'+productId, packet);
		this.exit ();
	}
};
</script>

