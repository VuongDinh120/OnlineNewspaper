const express = require('express');
const moment = require('moment');
const bcrypt = require('bcrypt');
const tagModel = require('../models/tag.model');
const newsModel = require('../models/news.model');
const passport = require("../middlewares/passport.mdw");
const config = require('../config/default.json');
const accountModel = require('../models/account.model');
const { ensureAuthenticated, forwardAuthenticated, ensureAuthenticatedAdmin, ensureAuthenticatedWriter, ensureAuthenticatedEditor } = require('../config/auth');
const getCat = require('../config/getCat');

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
  res.redirect('/');
});

router.get('/istag-available', async function (req, res) {
  const tag = await tagModel.tagByname(req.query.tag);
  if (tag) {
      return res.json(tag.TagID);
  }
  res.json(false);
})






module.exports = router;