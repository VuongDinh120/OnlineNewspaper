const express = require('express');
const multer = require('multer');
const fs = require('fs');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const tagingModel = require('../models/taging.model');
const newsModel = require('../models/news.model');
const accountModel = require('../models/account.model');
const getCat = require('../config/getCat');
const { ensureAuthenticated, forwardAuthenticated, ensureAuthenticatedAdmin, ensureAuthenticatedWriter, ensureAuthenticatedEditor } = require('../config/auth');
const router = express.Router();

const storage = multer.diskStorage({
    filename(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
    destination(req, file, cb) {
        cb(null, './public/img/articles');
    }
});
var upload = multer({ storage: storage });

router.get('/list-article',async function (req, res) {
    const user = req.user;
    const ob = await getCat();
    const listNews = await newsModel.allWithWriter(1);
    // for (let index = 0; index < listNews.length; index++) {
    //     listNews[index].stt = index + 1;
    // }
    res.render('vwWriter/list', {
        News: listNews,
        user,
        categories: ob.listMenu,
        isFull: ob.isfull,
        extras: ob.listExtra,
    });
})
router.get('/view-article',async function (req, res) {
    const user = req.user;
    const ob = await getCat();
    const id = req.query.id;
    const listCat = await categoryModel.allNameCat();
    const Taging = await tagingModel.allByIDNews(id);
    const News = await newsModel.single(id);
    //const Writer = await accountModel.singleByNews(id);
    // if (Taging.length === 0 || News.length === 0)
    //     return res.send('Invalid parameter.');

    res.render('vwWriter/view', {
        cb_categories: listCat,
        news: News,
        taging: Taging,
        writer: user,
        user,
        categories: ob.listMenu,
        isFull: ob.isfull,
        extras: ob.listExtra,
    });
})
router.get('/new-article',async function (req, res) {
    const user = req.user;
    const listCat = await categoryModel.allNameCat();
    const listTag = await tagModel.all();
    const ob = await getCat();
    res.render('vwWriter/add', {
        cb_categories: listCat,
        tags: listTag,
        user,
        categories: ob.listMenu,
        isFull: ob.isfull,
        extras: ob.listExtra,
    });
})
router.post('/new-article', upload.single('fuNews'), async function (req, res) {
    // var today = new Date(); 
    const article = {
        Title: req.body.Title,
        TinyDes: req.body.TinyDes,
        FullDes: req.body.FullDes,
        Writer: req.user.UserID,
        // Writer: 1,
        CatID: req.body.CatID,
        IMG: req.file.filename,
        isPremium: parseInt(req.body.NewsType),
        StatusID: 4,
        LastEdit: new Date(),
    };
    const newTags = req.body.newtags;
    const availableTags = req.body.tags;
    
    const renewTags = [];
    if (newTags !== undefined) {
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
    const rs = await newsModel.add(article);
   
    for (let i = 0; i < Tags.length; i++) {
        await tagingModel.add(Tags[i], rs.insertId);
    }

    res.redirect('./list-article');
})
router.get('/edit-article', async function (req, res) {
    const user = req.user;
    const id = req.query.id;
    const ob = await getCat();
    const listCat = await categoryModel.allNameCat();
    const listTag = await tagModel.all();
    const Taging = await tagingModel.allByIDNews(id);
    const News = await newsModel.single(id);
    // if (Taging.length === 0 || News.length === 0) {
    //     return res.send('Invalid parameter.');
    // }
    res.render('vwWriter/edit', {
        cb_categories: listCat,
        tags: listTag,
        news: News,
        taging: Taging,
        user,
        categories: ob.listMenu,
        isFull: ob.isfull,
        extras: ob.listExtra,
    });
})
router.post('/edit-article', upload.single('fuNews'), async function (req, res) {
    
    const id = req.body.id;
    const article = {
        NewsID: req.body.id,
        Title: req.body.Title,
        TinyDes: req.body.TinyDes,
        FullDes: req.body.FullDes,
        Writer: req.user.UserID,
        // Writer: 1,
        CatID: req.body.CatID,
        isPremium: parseInt(req.body.NewsType),
        StatusID: 4,
        LastEdit: new Date(),
    };
    const oldIMG = req.body.oldIMG;
    if (req.file !== undefined) {
        article.IMG = req.file.filename;
        const filepa = req.file.destination + "/" + oldIMG;
        const a = fs.unlink(filepa, function (err) {
            if (err)
                console.log("Error while delete file " + err);
            else
                console.log("Delete succeed");
        });
    }

    await tagingModel.delByNewsID(article.NewsID);

    const newTags = req.body.newtags;
    const availableTags = req.body.tags;

    const renewTags = [];
    if (newTags !== undefined) {
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
    
    await newsModel.patch(article);
   
    for (let i = 0; i < Tags.length; i++) {
        await tagingModel.add(Tags[i], req.body.id);
    }

    res.redirect(`./view-article?id=${id}`);
})
router.post('/delete-article', async function (req, res) {
    await newsModel.remove(req.body.id);
    res.redirect(`./list-article`);
})




module.exports = router;