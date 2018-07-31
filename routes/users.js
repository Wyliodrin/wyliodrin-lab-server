'use strict';

var express = require('express');
var debug = require('debug')('development:user_route');
var uuid = require('uuid');
var db = require('../database/database.js');
var error = require('../error.js');
var publicApp = express.Router();
var privateApp = express.Router();

debug.log = console.info.bind(console);

function createToken() {
    return uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();
}

// TODO : Use body parser doar pe router


var tokens = {};

/**
 * @api {post} /create Create a user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiParam {String} firstName First name of user
 * @apiParam {String} email Email of user
 *
 * @apiSuccess {Number} err 0 
 * @apiError {String} err Error
 * @apiError {String} statusError error
 */
publicApp.post('/create', async function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    try {
        let user = await db.user.create(username, password, firstName, lastName, email);
        try {
            await db.workspace.createUserHome(user.userId);
        } catch (err) {
            // TODO Trimite eroare corecta spre client
            debug('Error creating workspace', err);
            error.sendError(res, error.serverError());
        }
        // TODO: Create user workspace
        res.status(200).send({});
    } catch (err) {
        if (err.code !== 11000) {
            debug('Creation failed', { requestId: req.requestId, error: err });
            error.sendError(res, error.serverError());
        } else {
            debug('Creation failed, user exists', { requestId: req.requestId, error: err });
            error.sendError(res, error.notAcceptable('User already exists'));
        }
    }
});

publicApp.post('/login', async function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        debug('Searching for ' + username);
        let user = await db.user.findByUsernameAndPassword(username, password);
        if (user) {
            // TODO: Find out if user is already logged in
            debug('Found user ' + user);
            //debug(user);
            var token = createToken();
            tokens[token] = user.userId;
            debug('User ' + user.username + ':' + user.userId + ' logged in');
            res.status(200).send({ err: 0, token: token });
            debug(tokens);
        } else {
            debug(res, error.serverError());
            error.sendError(res, error.unauthorized('User or password are not correct'));
        }
    } else {
        error.sendError(res, error.badRequest('All fields are required'));
    }
});

async function security(req, res, next) {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token && req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.Authorization.split(' ')[1];
    }
    if (!token) {
        token = req.query.token;
    }
    if (!token) {
        token = req.body.token;
    }
    req.token = token;
    let user;
    if (token) {
        debug('got token', token);
        var userId = tokens[token];
        user = await db.user.findByUserId(userId);
    }
    debug('token non existent');
    if (user) {
        req.user = user;
        next();
    } else {
        error.sendError(res, error.unauthorized('Please login first'));
    }
}

privateApp.post('/edit', async function(req, res) {
    if (req.body.firstname || req.body.lastName || req.body.email) {
        try {
            await db.user.edit(req.user.userId, req.body.email,
                req.body.firstName, req.body.lastName);
            debug(req.user.userId + 'changed his info');
            res.status(200).send({ err: 0 });
        } catch (err) {
            debug(err.message);
        }
    } else {
        error.sendError(res, error.badRequest('At least one field is required'));
    }
});

privateApp.get('/', async function(req, res) {
    debug('User: ' + req.user.userId + 'requested /');
    let user = await db.user.findByUserId(req.user.userId);
    res.status(200).send({ err: 0, user });
});

privateApp.post('/password/edit', async function(req, res) {
    var oldPass = req.body.oldPassword;
    var newPass = req.body.newPassword;
    if (oldPass && newPass) {
        debug('Editing password');
        if (oldPass !== newPass) {
            let data = await db.user.editPassword(req.user.userId, oldPass, newPass);
            if (data.n === 1) {
                debug('User ' + req.user.userId + ' changed his password');
                res.status(200).send({ err: 0 });
            } else {
                debug('User ' + req.user.userId + 'password change fail');
                error.sendError(res, error.badRequest('Wrong password'));
            }
        } else {
            error.sendError(res, error.badRequest('Please do not use the same password'));
        }
    } else {
        error.sendError(res, error.badRequest('Wrong input'));
    }
});

privateApp.get('/list/:partOfName', async function(req, res) {
    if (req.params.partOfName && req.params.partOfName.length >= 3) {
        var userList = await db.user.findUsers(req.params.partOfName);
        res.status(200).send(userList);
    } else {
        error.sendError(res, error.badRequest('Name is required'));
    }
});

privateApp.get('/logout', async function(req, res) {
    delete tokens[req.token];
    debug(req.user.userId + ' logged out');
    res.status(200).send({ err: 0 });
});

privateApp.get('/logout/:tokenId', async function(req, res) {
    delete tokens[req.token];
    debug(req.user.userId + ' logged out for ' + req.params.tokenId);
});

module.exports.publicRoutes = publicApp;
module.exports.security = security;
module.exports.privateRoutes = privateApp;