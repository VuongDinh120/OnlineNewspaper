const express = require('express');
const moment = require('moment');
const bcrypt = require('bcrypt');
const categoryModel = require('../models/category.model');
const newsModel = require('../models/news.model');
const passport = require("../middlewares/passport.mdw");
const config = require('../config/default.json');
const accountModel = require('../models/account.model');
const { ensureAuthenticated, ensureAuthenticatedAdmin } = require('../config/auth');

const router = express.Router();

var getCat = function (listCat, listMenu, listExtra) {
  for (let i = 0; i < listMenu.length; i++) {
    const a = [];
    for (let j = 0; j < listCat.length; j++) {
      if (listMenu[i].CatID === listCat[j].ParentID) {
        a.push(listCat[j].CatName);
      }
    }
    listMenu[i].Descendants = a;
  }

  let countExtra = listMenu.length - 8;
  let isfull;

  if (countExtra == 0) {
    isfull = true;
  } else if (countExtra > 0) {
    isfull = false;
    for (let i = 1; i <= countExtra; i++) {
      let item = listMenu.pop();
      listExtra.push(item);
    }
  }
  return isfull;
}

router.get('/', async function (req, res) {
  const user = req.user;
  const listCat = await categoryModel.all();
  const listMenu = await categoryModel.allWithOnlyFirstNode();
  const listExtra = new Array();
  const isfull = getCat(listCat, listMenu, listExtra);
  res.render('home', {
    categories: listMenu,
    isFull: isfull,
    extras: listExtra,
    user
  });
})

router.get('/list-by-Cat', async function (req, res) {
  // const listNews = await newsModel.single();
  const listCat = await categoryModel.all();
  const listMenu = await categoryModel.allWithOnlyFirstNode();
  const listExtra = new Array();
  const isfull = getCat(listCat, listMenu, listExtra);

  res.render('list', {
    categories: listMenu,
    isFull: isfull,
    extras: listExtra,
    // page_items,
    // prev_value: page - 1,
    // next_value: page + 1,
    // can_go_prev: page > 1,
    // can_go_next: page < nPages
  });
})

router.get('/auth/:id', async function (req, res) {
  const id = req.params.id;
  var messages = req.flash('error');
  var success = req.flash('success_msg');
  if (id === 'login' || id === 'register') {
    const result = (id === 'login') ? true : false;
    res.render('vwUser/auth', {

      error: messages,
      isLog: result,
      success_msg: success
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

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


// router.get('/', function (req, res) {
//   if (req.isAuthenticated())
//       res.redirect('/admin')
//   else
//       res.render('login');
// })





module.exports = router;