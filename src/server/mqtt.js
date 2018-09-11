var mosca = require ('mosca');

log = {error:console.log, info:console.log}



var authorizeSubscribe = function(client, topic, callback) {
	callback(null, function(){
		if (topic === 'broadcast'){
			return true;
		}
		else{
			let top = topic.split('/');
			if (top.length > 0){
				if (top[0] === 'in'){
					if (top.length > 1){
						if (client.id === top[1]){
							return true;
						}
					}
					else{
						return false;
					}
					
				}
				else if (top[0] === 'out'){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}
	});
}
  
var authorizePublish = function(client, topic, payload, callback) {
	callback(null, function(){
		if (topic === 'broadcast'){
			return true;
		}
		else{
			let top = topic.split('/');
			if (top.length > 0){
				if (top[0] === 'out'){
					if (top.length > 1){
						if (client.id === top[1]){
							return true;
						}
					}
					else{
						return false;
					}
					
				}
				else if (top[0] === 'in'){
					return true;
				}
				else{
					return false;
				}
			}
			else{
				return false;
			}
		}
	});
}


var server = new mosca.Server ({
	port: process.env.MOSCA_SERVER_PORT || 1883,
});


server.on ('error', function (err)
{
	log.error (err, 'MQTT Mosca  '+err);
});

server.on ('ready', function ()
{
	log.info ('MQTT: Mosca server started');
	server.authorizePublish = authorizePublish;
  	server.authorizeSubscribe = authorizeSubscribe;
});

server.on('published', function(packet, client) {
	log.info ('MQTT: Published packet '+JSON.stringify({packet: packet}));
});

server.on('clientConnected', function(client) {
	log.info('MQTT: Client Connected '+client.id);
});


server.on('clientDisconnected', function(client) {
	log.info('MQTT: Client Disconnected '+client.id);
});

