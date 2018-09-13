
/* global freeboard, $ */

window.wyliodrinData = function ()
{
	var ReconnectingWebSocket = require ('reconnectingwebsocket');
	var _ = require ('lodash');
	var EventEmitter = require ('events').EventEmitter;

	var socket = null;
	var authenticated = false;
	var connected = false;

	let token = window.localStorage.getItem ('wyliodrin.token');
	let projectId = new URLSearchParams(window.location.search).get ('projectId');

	// console.log (projectId);

	let loadDashboard = function ()
	{
		$.ajax ({
			url:'/api/v1/project/dashboard/'+projectId,
			method:'GET',
			headers: {
				Authorization: 'Bearer '+token
			}
		}).done (function (data)
		{
			try
			{
				freeboard.loadDashboard (data.dashboard, function ()
				{
					console.log ('Load dashboard');
					savedDashoard = data.dashboard;
					// console.log (data);
					saveDashboard ();
				});
			}
			catch (e)
			{
				saveDashboard ();
			}
		});
	};

	setInterval (function ()
	{
		if (socket && connected && authenticated)
		{
			socket.send (JSON.stringify ({
				t: 'ping'
			}));
		}
	}, 10000);

	let savedDashoard = {};

	let saveDashboard = function () {
		let dashboard = freeboard.serialize ();
		// console.log (dashboard);
		if (!_.isEqual (savedDashoard, dashboard))
		{
			// console.log (dashboard);
			$.ajax ({
				url:'/api/v1/project/dashboard/'+projectId,
				method:'POST',
				headers: {
					Authorization: 'Bearer '+token
				},
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify ({
					dashboard: dashboard
				})
			}).done (function (data)
			{
				if (data.err === 0)
				{
					savedDashoard = dashboard;
				}		
			});
		}
		setTimeout (saveDashboard, 3000);
	};

	loadDashboard ();

	let socketEngine = _.assign (new EventEmitter(), {
		connect (token)
		{
			// console.log ('connect');
			socket = new ReconnectingWebSocket ((location.protocol==='http:'?'ws':'wss')+'://'+location.hostname+':'+location.port+'/socket/ui');
			
			socket.onopen = function ()
			{
				connected = true;
				console.log ('UI Socket connected');
				socket.send (JSON.stringify({t:'a', token:token}));
				// console.log ('UI Socket sent authenticate');
			};
			
			socket.onmessage = function (evt)
			{
				let m = evt.data;
				// console.log (m);
				try
				{
					let data = JSON.parse (m);
					if (data.t === 'a')
					{
						if (data.authenticated === true) authenticated = true;
					}
					else
					{
						socketEngine.emit (data.t, data);
					}
				}
				catch (e)
				{
					console.error ('UI Socket '+e.message);
				}
			};
			socket.onerror = function (err)
			{
				console.error ('UI Socket '+err);
			};
			socket.onclose = function ()
			{
				connected = false;
				authenticated = false;
				console.log ('UI Socket disconnected');
			};
			return socket;
		}
	});

	socketEngine.connect (token);

	var wyliodrinDashboardDatasource = function (settings, updateCallback) {
		var currentSettings = settings;
		

		socketEngine.on ('signal', function (data)
		{
			if ((!currentSettings.appId || data.appId === currentSettings.appId) && data.productId === currentSettings['productId'])
			{
				if (currentSettings.signal)
				{
					if (data[currentSettings.signal])
					{
						updateCallback (data.signal[currentSettings.signal]);
					}
				}
				else
				{
					updateCallback (data.signal);
				}
			}
		});

		this.onDispose = function () {
			
		};

		this.onSettingsChanged = function (newSettings) {
			currentSettings = newSettings;
			// updateRefresh(currentSettings.refresh * 1000);
			// self.updateNow();
		};

		this.updateNow = function ()
		{

		};
	};

	freeboard.loadDatasourcePlugin({
		type_name: 'Application or Product Signal',
		settings: [
			{
				name: 'productId',
				display_name: 'Product ID',
				description: 'The productId to from where to collect the data, leave empty for all products',
				// TODO options
				type: 'text'
			},
			{
				name: 'appId',
				display_name: 'Application ID',
				description: 'The appId from where to collect the data, leave empty for all apps',
				type: 'text',
				// default_value: true
			},
			{
				name: 'signal',
				display_name: 'Signal',
				description: 'The signal name where to collect the data, leave empty for all signals',
				type: 'text',
				default_value: ''
			},
		],
		newInstance: function (settings, newInstanceCallback, updateCallback) {
			newInstanceCallback(new wyliodrinDashboardDatasource(settings, updateCallback));
		}
	});

};
