const express = require('express');
const multer = require('multer');
const moment = require('moment');
const accountModel = require('../models/account.model');
const premierModel = require('../models/premier.model');
const bcrypt = require('bcrypt');
const router = express.Router();
const config = require('../config/default.json');
const getCat = require('../config/getCat');
const { ensureAuthenticated, forwardAuthenticated, ensureAuthenticatedAdmin, ensureAuthenticatedWriter, ensureAuthenticatedEditor } = require('../config/auth');

var date_diff_indays = function (date) {
    const now = new Date();
    var a = moment();
    var b = moment(date);
    // var ms = moment(date, "DD/MM/YYYY HH:mm:ss").diff(moment(now, "DD/MM/YYYY HH:mm:ss"));
    // var d = moment.duration(ms);
    // var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    // return s;
    return b.diff(a);
}
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/img/user');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage }).single('userPhoto');

router.get('/profile', ensureAuthenticated, async function (req, res) {
    const user = req.user;
    console.log(user)
    const ob = await getCat();
    const acc = await accountModel.singleByID(req.query.id);
    var messages = req.flash('error');
    var success = req.flash('success_msg');
    acc.isExpire = -1;
    console.log(acc)
    console.log(date_diff_indays(acc.PremiumExpireTime));
    if (acc.PremiumExpireTime != null) {
        if (date_diff_indays(acc.PremiumExpireTime) > 0)
            acc.isExpire = 0;
        else
            acc.isExpire = 1;
    };
    res.render('vwUser/profile', {
        Account: acc,
        error: messages,
        success_msg: success,
        user,
        categories: ob.listMenu,
        isFull: ob.isfull,
        extras: ob.listExtra,
    });
})
router.post('/profile/upi', async function (req, res) {
    // const date = new Date(req.body.birthday);
    const dob = moment(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const user = {
        UserID: req.user.UserID,
        UserName: req.body.UserName,
        FullName: req.body.FullName,
        BirthDay: dob
    }
    await accountModel.patch(user);
    req.flash('success_msg', 'Đổi thông tin thành công');
    res.redirect(`../profile?id=${req.user.UserID}`);
})
router.post('/profile/upe', async function (req, res) {
    const entity = {
        UserID: req.user.UserID,
        Email: req.body.Email,
    }
    console.log(entity);
    await accountModel.patch(entity);
    req.flash('success_msg', 'Đổi email thành công');
    res.redirect(`../profile?id=${req.user.UserID}`);
})
router.post('/profile/uppw', async function (req, res) {
    const acc = await accountModel.singleByID(req.user.UserID);
    // console.log(acc);
    const password_hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
    // console.log(password_hash);
    const match = await bcrypt.compare(password_hash, acc.PassWord);

    if (match) {
        const newpassword_hash = bcrypt.hashSync(req.body.newPassword, config.authentication.saltRounds);
        const entity = {
            UserID: req.user.UserID,
            PassWord: newpassword_hash,
        }
        await accountModel.patch(entity);
        req.flash('success_msg', 'Đổi mật khẩu thành công');
    } else {
        req.flash('error', 'Lỗi: Mật khẩu cũ không khớp!!');
    }
    res.redirect(`../profile?id=${req.user.UserID}`);
})
router.post('/api/photo', function (req, res) {
    upload(req, res, async function (err) {
        const ob = { UserID: req.user.UserID, Avatar: req.file.filename };

        await accountModel.patch(ob);
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

router.get('/buy-premier', ensureAuthenticated, async function (req, res) {
    const isRegPass = req.session.passpremier || null;
    const user = req.user;
    const ob = await getCat();
    console.log(isRegPass);
    res.render('vwUser/buyPremier', {
        user,
        isRegPass,
        categories: ob.listMenu,
        isFull: ob.isfull,
        extras: ob.listExtra,
    });
})

router.post('/buy-premier', ensureAuthenticated, async function (req, res) {
    // const date = new Date(req.body.birthday);

    const entity = {
        ApplyingTime: new Date(),
        UserID: req.user.UserID,
        State: 0
    }
    await premierModel.add(entity);
    req.session.passpremier = true;
    req.flash('success_msg', 'Đăng kí gói premier thành công, Chờ để được admin phê duyệt');
    res.redirect(`/`);
})

router.get('/is-available', async function (req, res) {
    const user = await accountModel.singleByName(req.query.user);
    if (!user) {
        return res.json(true);
    }
    res.json(false);
})

router.get('/isEmail-available', async function (req, res) {
    const email = await accountModel.checkEmail(req.query.email);
    if (!email) {
        return res.json(true);
    }
    res.json(false);
})


module.exports = router;
