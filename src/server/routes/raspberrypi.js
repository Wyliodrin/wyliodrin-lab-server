'use strict';

var express = require('express');
var debug = require('debug')('wyliodrin-lab-server:raspberrypi-routes');
var db = require('../database/database.js');
var error = require('../error.js');

var privateApp = express.Router();
var adminApp = express.Router();

privateApp.get('/list', async function(req, res, next) {
	req.debug(debug, 'User accessed route /list');
	try {
		req.debug(debug, 'List images');
		var images = await db.image.listImagesAsArray();
	} catch (err) {
		req.debug(debug, 'Error listing image: ', err);
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0, images });
});

adminApp.get('/boot/:id', async function(req, res, next) {
	try {
		let id = req.params.id;
		req.debug(debug, 'Boot image ' + id);
		await db.image.saveDefaultImage(id);
	} catch (err) {
		req.debug(debug, 'Error booting image: ', err);
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.get('/setup/:id', function(req, res, next) {
	try {
		let id = req.params.id;
		req.debug(debug, 'Setup image ' + id);
		db.image.setupServer(id);
	} catch (err) {
		req.debug(debug, 'Error while setup image ');
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.get('/update/:id', function(req, res, next) {
	try {
		let id = req.params.id;
		req.debug(debug, 'Update image ' + id);
		db.image.setupServer(id, true);
	} catch (err) {
		req.debug(debug, 'Error while update image ');
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.post('/download', function(req, res, next) {
	try {
		let link = req.body.link;
		req.debug(debug, 'Download image ' + link);
		db.image.downloadImage(link);
		// TODO Delete image
		// var images = await db.image.listImagesAsArray ();
	} catch (err) {
		req.debug(debug, 'Error downloading image ');
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

adminApp.get('/delete/:id', async function(req, res, next) {
	try {
		// TODO Delete image
		if (db.image.defaultImageId() !== req.params.id) {
			req.debug(debug, 'Deleting image ');
			await db.image.deleteImage(req.params.id);
		} else {
			req.debug(debug, 'Cannot delete default image ');
			let e = error.unauthorized('Cannot delete Default Image');
			return next(e);
		}
	} catch (err) {
		req.debug(debug, 'Error deleting image ');
		let e = error.serverError(err);
		return next(e);
	}

	res.status(200).send({ err: 0 });
});

privateApp.get('/default', async function(req, res, next) {
	var e;
	try {
		req.debug(debug, 'Load default image');

		let image = await db.image.loadDefaultImage();
		if (image) {
			res.status(200).send({ err: 0, image });
		} else {
			req.debug(debug, 'Default image not found');
			e = error.notFound('Default image not found');
			next(e);
		}
	} catch (err) {
		req.debug(debug, 'Error while loading default image');
		e = error.serverError(err);
		next(e);
	}
});

adminApp.post('/default', async function(req, res, next) {
	var e;
	var id = req.body.id;
	try {
		req.debug(debug, 'Save default image');
		let valid = await db.image.saveDefaultImage(id);
		if (valid) {
			res.status(200).send({ err: 0 });
		} else {
			req.debug(debug, 'Invalid Image ID');
			e = error.badRequest('Invalid image ID');
			next(e);
		}
	} catch (err) {
		req.debug(debug, 'Error while saving default image');
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