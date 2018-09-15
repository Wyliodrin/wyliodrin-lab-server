require('dotenv').config();
process.env.CLI_ACTIVE = true;
var Table = require('cli-table');
var db = require('./database/database.js');
var readlineSync = require('readline-sync');


require('yargs')
	.command(['list'],'', {}, listUsers)
	.command(['password <user>'],'', {}, changePassword)
	.command(['username <user>'], '', {}, changeUsername)
	.demandCommand(1)
	.strict()
	.argv;


async function listUsers() {
	let users = await db.user.listUsers();
	let header = ['ID', 'Username', 'First Name', 'Last Name', 'E-mail', 'Role'];
	let table = new Table ({
		head: header
	});
	let id = 1;

	users.forEach(function(user) {
		table.push([id, user.username, user.firstName, user.lastName, user.email, user.role]);
		id ++;
	});

	console.log(table.toString());
	process.exit(-1);
}


async function changePassword(argv) {
	let user = await db.user.findByUsername(argv.user);
	if (user === null) {
		console.log('\nThe username you entered is not in the database!\nProcess exit!\n');
		process.exit(-1);
	} else {
		let userId = user.userId;
		let newPassword = readlineSync.question('Please input the new password: ');
		let newConfirmPassword = readlineSync.question('Please confirm the password: ');

		if (newPassword === newConfirmPassword) {
			console.log('Changing password...');
			await db.user.resetPassword(userId, newPassword);
			console.log('Password changed!');
			console.log('New password: ' + newPassword);

			process.exit(-1);
		} else {
			console.log('The two passwords doesn\'t match!');
			process.exit(-1);
		}
	}
}


async function changeUsername(argv) {
	let user = await db.user.findByUsername(argv.user);
	if (user === null) {
		console.log('\nThe username you entered is not in the database!\nProcess exit!\n');
		process.exit(-1);
	} else {
		let userId = user.userId;
		let newName = readlineSync.question('Please input the new username: ');

		console.log('Changing username...');
		await db.user.edit(userId, newName, null, null, null, null, null);
		console.log('Username changed!');
		console.log('New username: ' + newName);

		process.exit(-1);
	}
}
