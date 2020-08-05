const express = require('express');
const multer = require('multer');
const accountModel = require('../models/account.model');

const router = express.Router();
var date_diff_indays = function (date) {
    dt1 = new Date(date);
    dt2 = new Date();
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
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

router.get('/profile', async function (req, res) {
    const user = await accountModel.singleByID(1);
    user.isExpire = -1;
    // console.log(user);
    if (user.PremiumExpireTime != null) {
        if (date_diff_indays(user.PremiumExpireTime) > 0)
            user.isExpire = 0;
        else
            user.isExpire = 1;
    };
    res.render('vwUser/profile', {
        User: user
    });
})
router.post('/profile/upi', async function (req, res) {
    const date = new Date(req.body.birthday);
    const user = {
        UserID: 1,
        UserName: req.body.UserName,
        FullName: req.body.FullName,
        BirthDay: date
    }
    await accountModel.patch(user);

    res.redirect('../profile');
})
router.post('/profile/upe', async function (req, res) {
    const user = {
        UserID: 1,
        Email: req.body.Email,
    }
    await accountModel.patch(user);
    res.redirect('../profile');
})
router.post('/profile/uppw', async function (req, res) {
    const user = {
        UserID: 1,
        PassWord: req.body.NewPassWord,
    }
    await accountModel.patch(user);
    res.redirect('../profile');
})

router.post('/api/photo', function (req, res) {
    upload(req, res, async function (err) {
        const ob = { UserID: 1, Avatar: req.file.filename };
        await accountModel.patch(ob);
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});



module.exports = router;
