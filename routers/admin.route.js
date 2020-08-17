const express = require('express');
const moment = require('moment');
const multer = require('multer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const tagingModel = require('../models/taging.model');
const newsModel = require('../models/news.model');
const accountModel = require('../models/account.model');
const premierModel = require('../models/premier.model');
const assignModel = require('../models/assign.model');
const config = require('../config/default.json');

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

const storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/img/user');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload2 = multer({ storage: storage2 });


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

router.get('/news/list', async function (req, res) {
    const user = req.user;
    const listNews = await newsModel.all();
    res.render('vwAdmin/news/list', {
        News: listNews,
        user
    });
})
router.get('/news/view/:id', async function (req, res) {
    const user = req.user;
    const id = +req.params.id || -1;
    const Taging = await tagingModel.allByIDNews(id);
    const News = await newsModel.single(id);

    res.render('vwAdmin/news/view', {

        news: News,
        taging: Taging,
        user,
    });
})
router.get('/news/add', async function (req, res) {
    const user = req.user;
    const listCat = await categoryModel.allNameCat();
    const listTag = await tagModel.all();
    res.render('vwAdmin/news/add', {
        cb_categories: listCat,
        tags: listTag,
        user,
    });
})
router.post('/news/add', upload.single('fuNews'), async function (req, res) {
    const da = req.body.releaseDate;
    const myDate = moment(da.format('DD/MM/YYYY HH:mm')).format("YYYY-MM-DD HH:mm");
    const article = {
        Title: req.body.Title,
        TinyDes: req.body.TinyDes,
        FullDes: req.body.FullDes,
        // Writer: req.user.UserID,
        Writer: 1,
        CatID: req.body.CatID,
        IMG: req.file.filename,
        isPremium: parseInt(req.body.NewsType),
        StatusID: 4,
        LastEdit: new Date(),
        ReleaseDate: myDate
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

    res.redirect(`./view/${rs.insertId}`);
})
router.get('/news/edit', async function (req, res) {
    const user = req.user;
    const id = req.query.id;
    const listCat = await categoryModel.allNameCat();
    const listTag = await tagModel.all();
    const Taging = await tagingModel.allByIDNews(id);
    const News = await newsModel.single(id);
    res.render('vwAdmin/news/edit', {
        cb_categories: listCat,
        tags: listTag,
        news: News,
        taging: Taging,
        user,
    });
})
router.post('/news/edit', upload.single('fuNews'), async function (req, res) {
    const id = req.body.id;
    const article = {
        NewsID: req.body.id,
        Title: req.body.Title,
        TinyDes: req.body.TinyDes,
        FullDes: req.body.FullDes,
        // Writer: req.user.UserID,
        Writer: 1,
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

    res.redirect(`./view/${req.body.id}`);
})
router.post('/news/del', async function (req, res) {
    await newsModel.remove(req.body.id);
    res.redirect(`./list`);
})
router.post('/news/status', async function (req, res) {
    const article = {
        NewsID: req.body.id,
        StatusID: 2,
        ReleaseDate: new Date()
    };
    await newsModel.patch(article);
    res.redirect(`./view/${req.body.id}`);
})

router.get('/account/list', async function (req, res) {
    const user = req.user;
    const listAcc = await accountModel.all();
    res.render('vwAdmin/account/list', {
        account: listAcc,
        user
    });
})
router.get('/account/view/:id', async function (req, res) {
    const user = req.user;
    const id = +req.params.id || -1;
    const acc = await accountModel.singleByID(id);

    res.render('vwAdmin/account/view', {
        account: acc,
        user,
    });
})
router.get('/account/add', async function (req, res) {
    const user = req.user;
    const role = await accountModel.allRole();
    res.render('vwAdmin/account/add', {
        role,
        user,
    });
})
router.get('/account/edit/:id', async function (req, res) {
    const user = req.user;
    const id = req.params.id;
    const acc = await accountModel.singleByID(id);
    const role = await accountModel.allRole();
    res.render('vwAdmin/account/edit', {
        role,
        account: acc,
        user,
    });
})
router.post('/account/add', upload2.single('userPhoto'), async function (req, res) {
    const da = moment(req.body.birthdate);
    const myDate = moment(da.format('DD/MM/YYYY')).format("YYYY-MM-DD");
    const wname = req.body.pseudonym || null;
    const password_hash = bcrypt.hashSync(req.body.password, config.authentication.saltRounds);

    const account = {
        UserName: req.body.username,
        FullName: req.body.fullname,
        PassWord: password_hash,
        RoleID: req.body.role,
        Email: req.body.email,
        Pseudonym: wname,
        BirthDay: myDate,
        // Avatar: req.file.filename || null
    };
    if (req.file !== undefined) {
        account.Avatar = req.file.filename;
    }
    const rs = await accountModel.add(account);

    res.redirect(`./view/${rs.insertId}`);
})
router.post('/account/edit', upload2.single('userPhoto'), async function (req, res) {
    const da = moment(req.body.birthdate);
    const myDate = moment(da.format('DD/MM/YYYY')).format("YYYY-MM-DD");
    const wname = req.body.pseudonym || null;

    const account = {
        UserID: req.body.id,
        UserName: req.body.username,
        FullName: req.body.fullname,
        RoleID: req.body.role,
        Email: req.body.email,
        Pseudonym: wname,
        BirthDay: myDate
    };
    const oldIMG = req.body.oldIMG;
    if (req.file !== undefined) {
        account.Avatar = req.file.filename;
        const filepa = req.file.destination + "/" + oldIMG;
        const a = fs.unlink(filepa, function (err) {
            if (err)
                console.log("Error while delete file " + err);
            else
                console.log("Delete succeed");
        });
    }
    await accountModel.patch(account);

    res.redirect(`./view/${req.body.id}`);
})
router.post('/account/del', async function (req, res) {
    await accountModel.del(req.body.id);
    res.redirect(`./list`);
})

router.get('/account/list-premier', async function (req, res) {
    const user = req.user;
    const listAcc = await premierModel.all();
    res.render('vwAdmin/account/premier/list', {
        account: listAcc,
        user
    });
})
router.post('/account/accept-premier', async function (req, res) {
    var timeExpire = moment(new Date()).add(3, 'minutes').format('YYYY-MM-DD hh:mm:ss');
    const account = {
       UserID : req.body.id,
       PremiumExpireTime: timeExpire
    };
    // const entity = {
    //     UserID : req.body.id,
    //     PremiumExpireTime: timeExpire
    //  };
    await accountModel.patch(account);
    await premierModel.del(req.body.id);

    res.redirect(`./list-premier`);
})


router.get('/account/list-assign', async function (req, res) {
    const user = req.user;
    const listAcc = await assignModel.allEditor();
    res.render('vwAdmin/account/assign/list', {
        account: listAcc,
        user
    });
})
router.get('/account/view-assign', async function (req, res) {
    const user = req.user;
    const listassg = await assignModel.allAssign(req.query.id);
    const listCat = await categoryModel.allNameCat();
    res.render('vwAdmin/account/assign/view', {
        cate: listassg,
        cb_categories: listCat,
        editor: req.query.id,
        user
    });
})
router.post('/account/add-assign', async function (req, res) {
    const entity = {
        UserID: req.body.id,
        CatID: req.body.CatID
    }
    // console.log(entity);
    await assignModel.add(entity);
    res.redirect(`./view-assign?id=${req.body.id}`);
})
router.post('/account/del-assign', async function (req, res) {
  
    await assignModel.del(req.body.id);
    res.redirect(`./view-assign?id=${req.body.usid}`);
})
module.exports = router;