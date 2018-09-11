require('dotenv').config();
var Table = require('cli-table');
var db = require('./database/database.js');
var readlineSync = require('readline-sync');
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

require('yargs')
	.command(['list', 'l'],'', {}, listUsers)
	.command(['password <user>', 'p'],'', {}, makeChangePassword)
	.command(['username <user>', 'u'], '', {}, makeChangeUsername)
	.argv;



let userId = '';
let newPasswd = '';
let newConfirmPasswd = '';
let newName = '';


async function changeUsername() {
	newName = readlineSync.question('Please input the new username: ');
	console.log('Changing username...');
	await db.user.edit(userId, newName, null, null, null, null, null);
	console.log('Username changed!');
	console.log('New username: ' + newName);

	process.exit(-1);
}


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


function comparePasswords(i, cb) {
	let inputPasswd = function(passwd){
		newPasswd = passwd;
		rl.removeListener('line', inputPasswd);
		process.stdout.write('Please confirm the password: ');
		rl.on('line', inputConfirmPasswd);
	};

	let inputConfirmPasswd = function(passwd){
		newConfirmPasswd = passwd;
		rl.removeListener('line', inputConfirmPasswd);
		if (newPasswd !== newConfirmPasswd) {
			console.log('The passwords are not equal!\n');
			cb(i, false);
		} else {
			cb(i, true);
		}
	};

	process.stdout.write('\nPlease input the new password: ');
	rl.on('line', inputPasswd);
}


async function changePasswords() {
	console.log('Changing password...');
	await db.user.resetPassword(userId, newPasswd);
	console.log('Password changed!');
	console.log('New password: ' + newPasswd);
	process.exit();
}


async function makeChangePassword(argv) {
	console.log(argv.userName);
	let admin = await db.user.findByUsername(argv.user);
	if (admin === null) {
		console.log('\nThe username you entered is not in the database!\nProcess exit!\n');
		process.exit();
	} else {
		let user = await db.user.findByUsername(argv.user);
		userId = user.userId;

		let tryToChange = function(i, boolChangePasswd){
			if (boolChangePasswd === true) {
				changePasswords();
			} else if (i < 2) {
				comparePasswords(i + 1, tryToChange);
			} else {
				console.log('Too many tries!\nProcess exit!\n');
				process.exit();
			}
		};

		comparePasswords(0, tryToChange);
	}
}

async function makeChangeUsername(argv) {
	let admin = await db.user.findByUsername(argv.user);
	if (admin === null) {
		console.log('\nThe username you entered is not in the database!\nProcess exit!\n');
		process.exit();
	} else {
		let user = await db.user.findByUsername(argv.user);
		userId = user.userId;

		changeUsername();
	}
}
