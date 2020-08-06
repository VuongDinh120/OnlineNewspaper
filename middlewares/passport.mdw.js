const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const TB_USER = require('../models/account.model');

// const saltRounds = 10;
// const salt = bcrypt.genSaltSync(saltRounds);

passport.use(new localStrategy(
    async function (username, password, done) {
        const user = await TB_USER.singleByName(username);
        // console.log(user);
        if (user !== null) {
            const match = await bcrypt.compare(password, user.PassWord);
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Mật khẩu không đúng' });
            }
        } else {
            return done(null, false, { message: 'Không tồn tại tài khoản này' });
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.UserID);
})

passport.deserializeUser(async (id, done) => {
    const user = await TB_USER.singleSesByID(id);
    return done(null, user);
})

module.exports = passport;