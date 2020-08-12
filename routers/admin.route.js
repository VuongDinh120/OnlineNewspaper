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


router.get('/tags/list', async function (req, res) {
    const user = req.user;
    const list = await tagModel.all();
    res.render('vwAdmin/tag/list', {
        tags: list,
        user
    });
})
router.get('/tags/add', async function (req, res) {
    const user = req.user;
    res.render('vwAdmin/tag/add', {
        user
    });
})
router.post('/tags/add', async function (req, res) {
    const val = req.body.name;

    await tagModel.add(val.toLowerCase());

    res.redirect(`./list`);
})
router.get('/tags/edit/:id', async function (req, res) {
    const user = req.user;
    const id = +req.params.id || -1
    const row = await tagModel.single(id);
    res.render('vwAdmin/tag/edit', {
        tag: row,
        user
    });
})
router.post('/tags/edit', async function (req, res) {
    const entity = {
        TagID: req.body.id,
        TagName: req.body.name,
    };
    await tagModel.patch(entity);

    res.redirect(`./list`);
})
router.post('/tags/del', async function (req, res) {

    await tagModel.del(req.body.id);

    res.redirect(`./list`);
})


router.get('/category/list', async function (req, res) {
    const user = req.user;
    const listFather = await categoryModel.allWithOnlyFirstNode();
    const list1 = await categoryModel.allfisrt();
    const list2 = await categoryModel.allsecond();
    res.render('vwAdmin/category/list', {
        cat1: list1,
        cat2: list2,
        catfather: listFather,
        user
    });
})
router.get('/category/add', async function (req, res) {
    const user = req.user;
    const listFather = await categoryModel.allWithOnlyFirstNode();
    res.render('vwAdmin/category/add', {
        catfather: listFather,
        user
    });
})
router.post('/category/add', async function (req, res) {
    if (req.body.parent == -1) {
        const entity = {
            CatName: req.body.name,
        }
        await categoryModel.add(entity);
    } else {
        const entity = {
            CatName: req.body.name,
            ParentID: req.body.parent
        }
        await categoryModel.add(entity);
    }
    res.redirect(`./list`);
})
router.get('/category/edit/:id', async function (req, res) {
    const user = req.user;
    const id = +req.params.id || -1
    const row = await categoryModel.single(id);
    const listFather = await categoryModel.allWithOnlyFirstNode();
    res.render('vwAdmin/category/edit', {
        cat: row,
        catfather: listFather,
        user
    });
})
router.post('/category/edit', async function (req, res) {
    if (req.body.parent == -1) {
        const entity = {
            CatID: req.body.id,
            CatName: req.body.name,
            ParentID: null,
        }
        await categoryModel.add(entity);
    } else {
        const entity = {
            CatID: req.body.id,
            CatName: req.body.name,
            ParentID: req.body.parent
        }
        await categoryModel.add(entity);
    }

    res.redirect(`./list`);
})
router.post('/category/del', async function (req, res) {

    await categoryModel.del(req.body.id);
    res.redirect(`./list`);
})


module.exports = router;