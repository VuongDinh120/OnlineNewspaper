const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const TB_USER = require('../models/account.model');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

passport.use(new localStrategy(
    async function (username, password, done) {
        const user = await TB_USER.singleByName(username);
        console.log(user);
        if (user !== null) {
            const match = await bcrypt.compare(password, user.PassWord);
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Sai Mật khẩu' });
            }
        } else {
            return done(null, false, { message: 'Tên tài khoản đã được sử dụng' });
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user.ID);
})

passport.deserializeUser(async (id, done) => {
    const user = await TB_USER.singleByID(id);
    delete user.PassWord;
    return done(null, user);
})

module.exports = passport;