const express = require('express');
const categoryModel = require('../models/category.model');
const newsModel = require('../models/news.model');
const passport = require("../config/passport")
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
  const listCat = await categoryModel.all();
  const listMenu = await categoryModel.allWithOnlyFirstNode();
  const listExtra = new Array();
  const isfull = getCat(listCat, listMenu, listExtra);
  // const listNews = await newsModel.


  res.render('home', {
    categories: listMenu,
    isFull: isfull,
    extras: listExtra
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

router.get('/login', async function (req, res) {

  res.render('vwUser/auth');
})

router.post('/login', async function (req, res) {

  res.render('vwUser/auth');
})
router.post('/', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/',
  failureFlash: true
}))
router.get('/register', async function (req, res) {

  res.render('vwUser/register');
})
// router.get('/', function (req, res) {
//   if (req.isAuthenticated())
//       res.redirect('/admin')
//   else
//       res.render('login');
// })

// router.get('/logout', function (req, res) {
//   req.logout();
//   res.redirect('/');
// });



module.exports = router;