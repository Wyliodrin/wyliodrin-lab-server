require ('dotenv').config ();

var tftp = require ('tftp');
var ip = require ('ip');
var path = require ('path');
var fs = require ('fs-extra');
var db = require ('./database/database');

var IP_ADDRESS = process.env.WYLIODRIN_LAB_SERVER_IP || ip.address ();
var PORT = process.env.PORT || 3000;

var SERVER = process.env.WYLIODRIN_LAB_SERVER || ('http://'+IP_ADDRESS+':'+PORT);

function readBoardId (filename)
{
	let d = path.dirname (filename);
	let id = '';
	let add = false;
	for (let i = 0; i < d.length; i++)
	{
		if (d[i]!=='0') add = true;
		if (add === true) id = id + d[i];
	}
	return id;
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
	else
	{
		data.id = db.image.defaultImageId();
	}
	return data;
}

// console.log (IP_ADDRESS);

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
		if (boardId !== '.')
		{
			try
			{
				let pathBoot = db.image.pathBoot ();
				if (filename === 'start.elf')
				{
					// if (await db.image.hasSetup (boardId))
					// {
					// 	await db.image.unsetup (boardId);
					// }
					console.log ('Setting up image for board '+boardId);
					let data = await imageData (boardId, 'bootup');
					// console.log (data);
					await db.image.setup (boardId, data.userId, data.courseId, data.id);
					// TODO set default image if image not found
				}
				// console.log (pathBoot);
				console.log ('Request file for board '+boardId+' filename: '+filename);
				// console.log (req.stats);
				let data = null;
				if (filename === 'cmdline.txt')
				{
					try 
					{
						let params = await imageData (boardId);
						data = await db.image.cmdline (params.courseId, params.id, boardId, params.userId, { server: SERVER });
						console.log ('Set board '+boardId+' cmdline '+data);
					}
					catch (e)
					{
						console.log (e);
						console.error ('ERROR: cmdline.txt '+e.message);
					}
				}
				else
				if (filename === 'config.txt')
				{
					try 
					{
						let params = await imageData (boardId);
						data = await db.image.config (params.courseId, params.id, boardId, params.userId);
						// console.log ('config '+data);
					}
					catch (e)
					{
						console.log (e);
						console.error ('ERROR: config.txt '+e.message);
					}
				}
				else
				{
					// console.log (filename);
					data = await fs.readFile (path.join (pathBoot, filename));
				}
				if (data || data === '')
				{
					res.setSize (data.length);
					res.write (data);
					res.end ();
				}
				else
				{
					req.abort (tftp.ENOENT);
				}
			}
			catch (e)
			{
				// console.log (e);
				if (e.message.indexOf ('ENOENT')<0)
				{
					console.log (filename+' '+e.message);
					await db.board.boardStatus (boardId, 'noimage');
				}
				else
				{
					console.error (e);
				}
				req.abort (tftp.ENOENT);
			}
		}
		else
		{
			console.log ('Board id is .');
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
