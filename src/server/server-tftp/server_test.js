var tftp = require("./lib/index");
var path = require("path");
var fs = require("fs");
var errors = require("./lib/protocol/errors");
var ip = require ('ip');

var server = tftp.createServer({
    host: process.env.WYLIODRIN_LAB_SERVER_IP || ip.address (),
    root: path.join (__dirname),
    class: 'USO'
}, function(req, res) {
    req.on("error", function(error) {
        //Error from the request
        console.error("[" + req.stats.remoteAddress + ":" + req.stats.remotePort +
            "] (" + req.file + ") " + error.message);
    });

    //Call the default request listener
    this.requestListener(req, res);
});

server.on("error", function(error) {
    console.log(error);
});

// When there's a new request for serial_no/start.elf
server.on('newClientRequest', function() {
    console.log('CREATING CLIENT ENVIRONMENT')
    this.createClientEnvironment();
});

server.listen(() => {
    console.log('TFTP Server started');
});