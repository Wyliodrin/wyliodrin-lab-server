/*
var User = require('../models/User');

exports.addUser = function(myUser, cb) {
    User.findOne({ username: myUser.username }, function(err, user) {
        if (err) { cb(err); }
        if (user) {
            error = new Error('User already exists');
            cb(error);
        } else {
            var newUser = User({
                username: myUser.username,
                password: myUser.password,
                email: myUser.email,
                firstName: myUser.firstName,
                lastName: myUser.lastName,
            });
            newUser.save(cb);
        }
    });
};
*/