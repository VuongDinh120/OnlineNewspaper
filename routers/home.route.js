const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const listCat = await categoryModel.all();
  const listMenu = await categoryModel.allWithOnlyFirstNode();

  for (let i = 0; i < listMenu.length; i++) {
    const a = [];
    for (let j = 0; j < listCat.length; j++) {
      if (listMenu[i].CatID === listCat[j].ParentID) {
        a.push(listCat[j].CatName);
      }
    }
    listMenu[i].Descendants = a;
  }
  const listExtra = new Array();
  let countExtra = listMenu.length - 8;
  let isfull;
  if (countExtra == 0) {
    isfull = true;
  } else if (countExtra > 0) {
    for (let i = 1; i <= countExtra; i++) {
      let item = listMenu.pop();
      listExtra.push(item);
    }
  }
  res.render('home', {
    categories: listMenu,
    isFull: isfull,
    extras: listExtra
  });
})





module.exports = router;