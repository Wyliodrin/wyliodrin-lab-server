// var WebSocket = require ('ws');
var EventEmitter = require ('events').EventEmitter;
var _ = require ('lodash');
var msgpack = require ('msgpack5')();
var ReconnectingWebSocket = require ('reconnectingwebsocket');

module.exports.install = function (Vue)
{
	var socket = null;
	var authenticated = false;
	var connected = false;

	setInterval (function ()
	{
		if (socket && connected && authenticated)
		{
			socket.send (JSON.stringify ({
				t: 'ping'
			}));
		}
	}, 10000);

	Vue.socket = _.assign (new EventEmitter(), {
		send: function (tag, productId, data)
		{
			if (socket && authenticated)
			{
				socket.send (JSON.stringify ({
					t:'p',
					productId: productId, 
					data: msgpack.encode (data).toString ('base64')
				}));
			}
			else
			{
				console.log ('Socket is not authetnicated');
			}
		},
		connect (token)
		{
			socket = new ReconnectingWebSocket ((location.protocol==='http:'?'ws':'wss')+'://'+location.hostname+':'+location.port+'/socket/ui');
			// socket.on ('packet', function ()
			// {
			// 	Vue.socket.emit ('packet', arguments);
			// });
			socket.onopen = function ()
			{
				connected = true;
				console.log ('UI Socket connected');
				socket.send (JSON.stringify({t:'a', token:token}));
				// console.log ('UI Socket sent authenticate');
			};
			// socket.on ('reconnect', function ()
			// {
			// 	console.log ('UI Socket reconnected');
			// 	socket.emit ('authenticate', {
			// 		token: token
			// 	});
			// });
			// socket.on ('authenticate', function (data)
			// {
			// 	authenticated = data.authenticated || false;
			// });
			socket.onmessage = function (evt)
			{
				let m = evt.data;
				console.log (m);
				try
				{
					let data = JSON.parse (m);
					if (data.t === 'a')
					{
						if (data.authenticated === true) authenticated = true;
					}
					else
					if (data.t === 'p')
					{
						let packet = msgpack.decode (new Buffer(data.data, 'base64'));
						// console.log (packet);
						Vue.socket.emit ('packet', data.productId, packet);
						Vue.socket.emit ('packet:'+data.productId, packet);
					}
					else
					{
						Vue.socket.emit (data.t, data);
					}
				}
				catch (e)
				{
					console.error ('UI Socket '+e.message);
				}
			};
			socket.onerror = function (err)
			{
				console.error ('UI Socket '+err.message);
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
};