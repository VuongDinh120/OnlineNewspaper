const express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/', async function (req, res) {
  const listCat = await categoryModel.all();
  const listMenu = await categoryModel.allWithOnlyFirstNode();

  for (let i = 0; i < listMenu.length; i++) {
    const a = [];
    for (let j = 0; j < listCat.length; j++) {
      if (listMenu[i].CatID === listCat[j].DanhMucCha) {
        a.push(listCat[j].TenDanhMuc);
      }
    }
    listMenu[i].TenDanhMucCon = a;
  }
  const listExtra = new Array();
  let countExtra = listMenu.length - 8;
  let isfull = true;
  if (countExtra == 0) {
    isfull = false;
  } else if (countExtra > 0) {
    for (let i = 1; i <= countExtra; i++) {
      let item = listMenu.pop();
      listExtra.push(item);
    }
  }
  console.log(listExtra);
  res.render('home', {
    categories: listMenu,
    isfull: isfull,
    extras: listExtra
  });
})



module.exports = router;