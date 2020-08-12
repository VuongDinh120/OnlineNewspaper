const express = require('express');
const moment = require('moment');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const tagingModel = require('../models/taging.model');
const newsModel = require('../models/news.model');
const accountModel = require('../models/account.model');
const assignModel = require('../models/assign.model');
const { ensureAuthenticated, forwardAuthenticated, ensureAuthenticatedAdmin, ensureAuthenticatedWriter, ensureAuthenticatedEditor } = require('../config/auth');

const router = express.Router();

router.get('/list', ensureAuthenticatedEditor, async function (req, res) {
    const user = req.user;
    const listNews = await newsModel.allWithCat(user.UserID);
    const listCat = await assignModel.allCatAssign(user.UserID);
    res.render('vwEditor/list', {
        News: listNews,
        Assign: listCat,
        user
    });
})
router.get('/edit', ensureAuthenticatedEditor, async function (req, res) {
    const user = req.user;
    const id = req.query.id;
    const listCat = await categoryModel.allNameCat();
    const listTag = await tagModel.all();
    const Taging = await tagingModel.allByIDNews(id);
    const News = await newsModel.single(id);
    const Writer = await accountModel.singleByNews(id);
    if (Taging.length === 0 || News.length === 0)
        return res.send('Invalid parameter.');

    // console.log(News);
    res.render('vwEditor/edit', {
        cb_categories: listCat,
        news: News,
        tags: listTag,
        taging: Taging,
        writer: Writer,
        user
    });
})
router.post('/accept', async function (req, res) {
    // var today = new Date(); 
    const da = moment(req.body.releaseDate);
    const myDate = moment(da.format('DD/MM/YYYY HH:mm')).format("YYYY-MM-DD HH:mm");

    const id = req.body.id;
    const article = {
        NewsID: req.body.id,
        CatID: req.body.CatID,
        ReleaseDate: myDate,
        StatusID: 1,
    };
    const newTags = req.body.newtags || null;
    const availableTags = req.body.tags;
    // console.log('ádasdasdas')
    // console.log(newTags);
    await newsModel.patch(article);
    // console.log(req.body.tagchange);
    if (req.body.tagchange > 0 || newTags != null) {
        // console.log(req.body.tagchange);
        await tagingModel.delByNewsID(req.body.id);

        const renewTags = [];
        if (newTags != null) {
            for (let i = 0; i < newTags.length; i++) {
                const rstag = await tagModel.add(newTags[i]);
                renewTags.push(rstag.insertId);
            }
        }
        let Tags;
        if (renewTags === undefined) {
            Tags = availableTags;
        }
        else if (availableTags === undefined) {
            Tags = renewTags;
        } else {
            Tags = renewTags.concat(availableTags);
        }

        // console.log(Tags);
        for (let i = 0; i < Tags.length; i++) {
            await tagingModel.add(Tags[i], req.body.id);
        }
    }


    res.redirect(`./edit?id=${id}`);
})
router.post('/deny', async function (req, res) {
    // var today = new Date(); 
    const id = req.body.id;
    const article = {
        NewsID: req.body.id,
        Issue: req.body.issue,
        StatusID: 3,
    };
    await newsModel.patch(article);

    res.redirect(`./edit?id=${id}`);
})

module.exports = router;