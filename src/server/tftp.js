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

async function imageData (boardId, status)
{
	let data = {
	};
	let board = null;
	if (status)
	{
		board = await db.board.boardStatus (boardId, status);
	}
	else
	{
		board = await db.board.findByBoardId (boardId);
	}
	data.userId = board.userId;
	data.courseId = board.courseId;
	if (board.courseId) 
	{
		let course = await db.course.findByCourseId (board.courseId);
		if (course) data.id = course.imageId;
	}
	return data;
}

console.log (IP_ADDRESS);

var server = tftp.createServer ({
	host: IP_ADDRESS,
	port: 69,
	// root: __dirname,
	denyPUT: true
}, async function (req, res)
{
	if (req.method === 'GET')
	{
		let filename = path.basename (req.file);
		let boardId = readBoardId (req.file);
		try
		{
			let pathBoot = db.image.pathBoot ();
			if (filename === 'start.elf')
			{
				if (await db.image.hasSetup (boardId))
				{
					await db.image.unsetup (boardId);
				}
				console.log ('setting up image for '+boardId);
				let data = await imageData (boardId, 'bootup');
				await db.image.setup (boardId, data.userId, data.courseId, data.id);
			}
			// console.log (pathBoot);
			console.log ('boardId: '+boardId+' filename: '+filename);
			// console.log (req.stats);
			let data = null;
			if (filename === 'cmdline.txt')
			{
				let params = await imageData (boardId);
				data = await db.image.cmdline (params.courseId, params.id, boardId);
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
	}
	else
	{
		req.abort ();
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
