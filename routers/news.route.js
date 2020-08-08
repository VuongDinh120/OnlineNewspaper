const express = require('express');
const categoryModel = require('../models/category.model');
const newsModel = require('../models/news.model');
const tagModel = require('../models/tag.model');
const tagingModel = require('../models/taging.model');
const commentModel = require('../models/comment.model');
const { ensureAuthenticated, ensureAuthenticatedAdmin } = require('../config/auth');
const config = require('../config/default.json');
const getCat = require('../config/getCat');
const router = express.Router();

router.get('/', async function (req, res) {
    const user = req.user;

    const ob = await getCat();
    const row = await newsModel.single(req.query.id);
    const writer = await newsModel.WriterName(req.query.id);
    const taging = await tagingModel.allByIDNews(req.query.id);
    const newsRand = await newsModel.allWithSameCat(row.CatID, req.query.id);
    const comment = await commentModel.allByNews(req.query.id);

    const entity = { NewsID: row.NewsID, Views: row.Views + 1 }
    await newsModel.patch(entity);
    console.log(row);
    res.render('vwNews/news', {
        categories: ob.listMenu, isFull: ob.isfull, extras: ob.listExtra,
        news: row,
        newsRand, taging, writer, comment, user
    });
})

router.get('/list-by-Cat/:id', async function (req, res) {
    const user = req.user;
    const id = +req.params.id || -1;
    if (id === -1) {
        res.redirect('/');
    }
    const ob = await getCat();
    const page = +req.query.page || 1;
    const offset = (page - 1) * config.pagination.limit;
    const listNews = await newsModel.allbyCat(id, config.pagination.limit, offset);
    const listTaging = await tagingModel.allTagingNews();
    const fatherCat = await categoryModel.getfatherCat(id);
    let SonCat = null, titleCat = null;
    if (fatherCat == null) {
        SonCat = await categoryModel.getSonCat(id);
        titleCat = await categoryModel.getCatName(id);;
    } else {
        SonCat = await categoryModel.getSonCat(fatherCat.CatID);
        titleCat = fatherCat;
    }
    for (let i = 0; i < listNews.length; i++) {
        const a = [];
        for (let j = 0; j < listTaging.length; j++) {
            if (listTaging[j].NewsID == listNews[i].NewsID) {
                const ob = {
                    TagID: listTaging[j].TagID,
                    TagName: listTaging[j].TagName
                }
                a.push(ob)
            }
        }
        listNews[i].Tags = a;
    }
    const total = await newsModel.countbyCat(id);
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }
    res.render('vwNews/listbycat', {
        categories: ob.listMenu, isFull: ob.isfull, extras: ob.listExtra,
        news: listNews,
        titleCat, SonCat,
        SelectedCat: req.params.id,
        user,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
})

router.get('/search', async function (req, res) {
    const user = req.user;
    const key = req.query.keyword;
    const ob = await getCat();
    const page = +req.query.page || 1;
    const offset = (page - 1) * config.pagination.limit;
    const listNews = await newsModel.SearchNews(key, config.pagination.limit, offset);
    const listTaging = await tagingModel.allTagingNews();

    for (let i = 0; i < listNews.length; i++) {
        const a = [];
        for (let j = 0; j < listTaging.length; j++) {
            if (listTaging[j].NewsID == listNews[i].NewsID) {
                const ob = {
                    TagID: listTaging[j].TagID,
                    TagName: listTaging[j].TagName
                }
                a.push(ob)
            }
        }
        listNews[i].Tags = a;
    }

    const total = await newsModel.CountSearch(key);
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }

    res.render('vwNews/search', {
        categories: ob.listMenu, isFull: ob.isfull, extras: ob.listExtra,
        news: listNews,
        KeyWord: key,
        user,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
})

router.get('/list-by-tag/:id', async function (req, res) {
    const user = req.user;
    const id = +req.params.id || 0;
    if (id === 0) {
        res.redirect('/');
    }
    const ob = await getCat();
    const page = +req.query.page || 1;
    const offset = (page - 1) * config.pagination.limit;
    const listNews = await newsModel.allbytag(id, config.pagination.limit, offset);
    const tag = await tagModel.single(id);
    const listTaging = await tagingModel.allTagingNews();
    console.log(tag);
    for (let i = 0; i < listNews.length; i++) {
        const a = [];
        for (let j = 0; j < listTaging.length; j++) {
            if (listTaging[j].NewsID == listNews[i].NewsID) {
                const ob = {
                    TagID: listTaging[j].TagID,
                    TagName: listTaging[j].TagName
                }
                a.push(ob)
            }
        }
        listNews[i].Tags = a;
    }

    const total = await newsModel.countbytag(id);
    const nPages = Math.ceil(total / config.pagination.limit);
    const page_items = [];
    for (let i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }

    res.render('vwNews/listbytag', {
        categories: ob.listMenu, isFull: ob.isfull, extras: ob.listExtra,
        news: listNews,
        tag,
        user,
        page_items,
        prev_value: page - 1,
        next_value: page + 1,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
})


router.post('/comment', async function (req, res) {
    const entity = {
        NewsID: req.body.id,
        UserID: req.user.UserID,
        Content: req.body.comment,
        CommentDate: new Date(),
    }
    await commentModel.add(entity);
    res.redirect(`../news?id=${req.body.id}#txtComment`);
})




module.exports = router;