const express = require('express');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');

const router = express.Router();

router.get('/new-article', async function (req, res) {
    const listCat = await categoryModel.allNameCat();
    const listTag = await tagModel.all();

    res.render('vwWriter/writeNews', {
        cb_categories: listCat,
        tags: listTag
    });
})
router.post('/new-article', async function (req, res) {


    res.render('vwListArticles/list', {
        categories: listMenu,
        isFull: isfull,
        extras: listExtra
    });
})

module.exports = router;