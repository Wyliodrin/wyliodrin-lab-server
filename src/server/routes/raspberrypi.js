'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:raspberrypi-routes');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();
var adminApp = express.Router();

privateApp.get('/list', async function(req, res, next) {
	try {
		debug('List images');
		var images = await db.image.listImagesAsArray();
	} catch (err) {
		console.log (err);
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0, images });
});

adminApp.get('/boot/:id', async function(req, res, next) {
	try {
		let id = req.params.id;
		debug('Boot image ' + id);
		await db.image.saveDefaultImage (id);
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.get('/setup/:id', function(req, res, next) {
	try {
		let id = req.params.id;
		debug('Setup image ' + id);
		db.image.setupServer(id);
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.get('/update/:id', function(req, res, next) {
	try {
		let id = req.params.id;
		debug('Setup image ' + id);
		db.image.setupServer(id, true);
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.post('/download', function(req, res, next) {
	try {
		let link = req.body.link;
		db.image.downloadImage(link);
		// TODO Delete image
		// var images = await db.image.listImagesAsArray ();
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.get('/delete/:id', async function(req, res, next) {
	try {
		// TODO Delete image
		await db.image.deleteImage(req.params.id);
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

privateApp.get('/default', async function(req, res, next) {
	var e;
	try {
		let image = await db.image.loadDefaultImage();
		if (image) {
			res.status(200).send({ err: 0, image });
		} else {
			e = error.notFound('Default image not found');
			next(e);
		}
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/default', async function(req, res, next) {
	var e;
	var id = req.body.id;
	try {
		let valid = await db.image.saveDefaultImage(id);
		if (valid) {
			res.status(200).send({ err: 0 });
		} else {
			e = error.badRequest('Invalid image ID');
			next(e);
		}
	} catch (err) {
		e = error.serverError(err);
		next(e);
	}
});

// adminApp.post('/reload', async function(req, res, next) {
// 	var e;
// 	try {

// 	}
// });

module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;