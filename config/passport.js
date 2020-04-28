const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done) {
        let query = {username: username};
        User.findOne(query, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                return done(null, false, {message: 'No user found'});
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err
                if (isMatch) {
                    // console.log(user);
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong Password'});
                }
            });
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}