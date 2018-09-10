'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:raspberrypi-routes');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();
var adminApp = express.Router();

privateApp.get('/list', async function(req, res, next) {
	try {
		debug ('List images');
		var images = await db.image.listImagesAsArray ();
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0, images });
});

privateApp.get('/setup/:id', function(req, res, next) {
	try {
		let id = req.params.id;
		debug ('Setup image '+id);
		db.image.setupServer (id);
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.post('/download', function(req, res, next) {
	try {
		let link = req.body.link;
		db.image.downloadImage (link);
		// TODO Delete image
		// var images = await db.image.listImagesAsArray ();
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.get('/delete/:id', function(req, res, next) {
	try {
		// TODO Delete image
		// var images = await db.image.listImagesAsArray ();
	} catch (err) {
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

module.exports.privateRoutes = privateApp;
module.exports.adminRoutes = adminApp;