const express = require('express');
const multer = require('multer');
const accountModel = require('../models/account.model');

const router = express.Router();


router.get('/profile', async function (req, res) {
    const user = await accountModel.singleByID(1);

    // console.log(user);

    res.render('vwUser/profile', {
        User: user
    });
})
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/img/user');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage }).single('userPhoto');
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
