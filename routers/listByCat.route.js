const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const listNews = await categoryModel.all();

  
  res.render('vwListArticles/list', {
    categories: listMenu,
    isFull: isfull,
    extras: listExtra
  });
})



module.exports = router;