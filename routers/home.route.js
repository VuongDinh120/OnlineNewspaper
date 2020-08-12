const express = require('express');
const moment = require('moment');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
const tagModel = require('../models/tag.model');
const newsModel = require('../models/news.model');
const passport = require("../middlewares/passport.mdw");
const config = require('../config/default.json');
const accountModel = require('../models/account.model');
const { ensureAuthenticated, forwardAuthenticated, ensureAuthenticatedAdmin, ensureAuthenticatedWriter, ensureAuthenticatedEditor } = require('../config/auth');
const getCat = require('../config/getCat');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const user = req.user || false;
  const ob = await getCat();
  const news = {
    MostInterested: await newsModel.MostInterested(),
    MostView: await newsModel.MostView(),
    MostInterested_in_Category: await newsModel.MostInterested_in_Category(),
    Newest: await newsModel.Newest(),
  };

  res.render('home', {
    categories: ob.listMenu,
    isFull: ob.isfull,
    extras: ob.listExtra,
    news,
    user
  });
})

router.get('/auth/:id', forwardAuthenticated, async function (req, res) {
  const id = req.params.id;
  const ob = await getCat();
  var messages = req.flash('error');
  var success = req.flash('success_msg');
  if (id === 'login' || id === 'register') {
    const result = (id === 'login') ? true : false;
    res.render('vwUser/auth', {

      error: messages,
      isLog: result,
      success_msg: success,
      categories: ob.listMenu,
      isFull: ob.isfull,
      extras: ob.listExtra,
    });
  } else
    res.render('404');
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/auth/login',
  successRedirect: '/',
  failureFlash: true
}))

router.post('/register', async function (req, res) {
  const dob = moment(req.body.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
  const password_hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
  const entity = {
    UserName: req.body.username,
    PassWord: password_hash,
    FullName: req.body.fullname,
    Email: req.body.email,
    BirthDay: dob,
    RoleID: 4
  }
  const row = await accountModel.add(entity);
  // console.log(row);
  if (row.affectedRows > 0) {
    res.redirect('/');
  } else {
    req.flash('error', 'Đăng ký thất bại');
    res.redirect('/auth/register');
  }
})

router.get('/logout', ensureAuthenticated, function (req, res) {
  req.logout();
  res.redirect(req.headers.referer);
});


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.admin.email,
    pass: config.admin.password,
  },
});
router.post('/auth/forgot', async function (req, res) {

  const token = Date.now() + Math.round(Math.random() * 1E9) + req.body.email
  const token_hash = CryptoJS.SHA1(token).toString(CryptoJS.enc.Hex);
  var timeExpire = moment(new Date()).add(2, 'hours').format('YYYY-MM-DD hh:mm:ss');
  const entity = {
    Email: req.body.email,
    ResetPasswordToken: token_hash,
    ResetPasswordExpireTime: timeExpire
  }

  const row = await accountModel.patchByEmai(entity);

  var mailOptions = {
    to: req.body.email,
    from: config.admin.email,
    subject: 'Lấy lại mật khẩu ',
    text: 'Lấy lại tài khoản của bạn:.\n\n' +
      'Click vào link bên dưới để lấy lại tài khoản của bạn:\n\n' +
      'http://' + req.headers.host + '/auth/reset/' + token_hash + '\n\n'
  };
  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      console.log(err);
      req.flash('error', 'Gửi email thất bại');
      res.redirect('/auth/login');
    }
  });
  req.flash('success_msg', 'Kiểm tra email của bạn để lấy lại mật khẩu');
  res.redirect('/auth/login');
})

router.get('/auth/reset/:token', forwardAuthenticated, async function (req, res) {
  const token = req.params.token || 0;
  // if (token === null) {
  //   res.redirect('/auth/login');
  // }
  const ob = await getCat();
  const row = await accountModel.singleByToken(token);
  const currentdate = new Date();
  if (row) {
    if (row.ResetPasswordExpireTime > currentdate) {

      req.flash('error', 'Link reset của bạn đã hết hạn');
      res.redirect('/auth/login');
    }
    else {

      res.render('vwUser/reset', {
        user: row,
        categories: ob.listMenu,
        isFull: ob.isfull,
        extras: ob.listExtra,
      });
    }
  } else {

    req.flash('error', 'Link reset không hợp lệ');
    res.redirect('/auth/login');
  }
})

router.post('/auth/reset', async function (req, res) {
  const password_hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);
  console.log(req.body.id);
  const entity = {
    UserID: req.body.id,
    PassWord: password_hash,
  }
  const row = await accountModel.patch(entity);

  if (row.affectedRows > 0) {
    req.flash('success_msg', 'Reset mật khẩu thành công. Mời bạn đăng nhập lại');
    res.redirect('/auth/login');
  } else {
    req.flash('error', 'Reset mật khẩu thất bại');
    res.redirect('/auth/login');
  }
})

router.get('/istag-available', async function (req, res) {
  const tag = await tagModel.tagByname(req.query.tag);
  // console.log(tag);
  if (tag) {
    return res.json(tag.TagID);
  }
  res.json(false);
})

router.get('/iscat-available', async function (req, res) {
  let id = req.query.id;
  if (req.query.id == -1) id = null;
  const cat = await categoryModel.catByName(req.query.cat, id);
  // console.log(tag);
  if (cat) {
    return res.json(false);
  }
  res.json(true);
})






module.exports = router;