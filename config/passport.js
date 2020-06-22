const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const TB_USER = require('../models/account.models');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

passport.use(new localStrategy(
    async function (username, password, done) {
        const user = await TB_USER.singleByUser(username);
        console.log(user);
        if (user !== null) {
            const match = await bcrypt.compare(password, user.PASSWORD);
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        } else {
            return done(null, false, { message: 'That email is not registered' });
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.ID);
})

passport.deserializeUser(async (id, done) => {
    const user = await TB_USER.singleByID(id);
    delete user.PASSWORD;
    return done(null, user);
})

module.exports = passport;