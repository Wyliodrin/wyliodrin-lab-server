var redis = require('redis');
var { promisify } = require('util');
var uuid = require('uuid');

var client = redis.createClient();

function createToken() {
	return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const KEY = 'wyliodrin-lab-server:';

client.on('error', function(err) {
	console.log('Error' + err);
});

module.exports.get = getAsync;
module.exports.set = setAsync;
module.exports.del = delAsync;
module.exports.KEY = KEY;
module.exports.createToken = createToken;