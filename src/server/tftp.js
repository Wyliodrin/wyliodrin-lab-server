require ('dotenv').config ();

var tftp = require ('tftp');
var ip = require ('ip');
var path = require ('path');
var fs = require ('fs-extra');
var db = require ('./database/database');

var IP_ADDRESS = process.env.WYLIODRIN_LAB_SERVER_IP || ip.address ();

function readBoardId (filename)
{
	return path.dirname (filename);
}

var server = tftp.createServer ({
	host: IP_ADDRESS,
	port: 69,
	// root: __dirname,
	denyPUT: true
}, async function (req, res)
{
	let filename = path.basename (req.file);
	let boardId = readBoardId (req.file);
	try
	{
		let pathBoot = db.image.pathBoot ();
		if (!await db.image.hasSetup (boardId))
		{
			console.log ('setting up image for '+boardId);
			await db.image.setup (boardId);
		}
		// console.log (pathBoot);
		console.log ('boardId: '+boardId+' filename: '+filename);
		// console.log (req.stats);
		let data = null;
		if (filename === 'cmdline.txt')
		{
			data = await db.image.cmdline (null, null, boardId, null);
			console.log ('cmdline '+data);
		}
		else
		{
			// console.log (filename);
			data = await fs.readFile (path.join (pathBoot, filename));
		}
		res.setSize (data.length);
		res.write (data);
		res.end ();
	}
	catch (e)
	{
		if (e.message.indexOf ('ENOENT')<0)
		{
			console.log (filename+' '+e.message);
		}
		req.abort (tftp.ENOENT);
	}
});

server.on ('error', function (error){
	//Errors from the main socket
	//The current transfers are not aborted
	console.error (error);
});

server.on ('request', function (req){
	req.on ('error', function (error){
		//Error from the request
		//The connection is already closed
		console.error ('[' + req.stats.remoteAddress + ':' + req.stats.remotePort + '] (' + req.file + ') ' + error.message);
	});
	console.log (req.file);
});

server.listen (function ()
{
	console.log ('TFTP Server listening');
});
