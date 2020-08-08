const db = require('../utils/db');

const TBL_NEWS = 'news';
const TBL_TAGING = 'taging';
const TBL_CATEGORIES = 'category';
const TBL_User = 'account';
const TBL_Status = 'status';
const VW_listnew_editor = 'listnews_editor';
const VW_News_Writer = 'news_with_writer';
const VW_CatGroup = 'catgroup';
const VW_CatFamily = 'catfamily ';
module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_NEWS}`);
  },
  allbytag: function (id, limit, offset) {
    return db.load(`SELECT nw.*,cat.CatID,cat.CatName FROM ${TBL_NEWS} nw JOIN ${TBL_TAGING} tg on nw.NewsID = tg.NewsID join ${VW_CatGroup} cat on nw.CatID = cat.CatID WHERE tg.TagID = ${id} LIMIT ${limit} OFFSET ${offset}`);
  },
  countbytag: async function (id) {
    const rows = await db.load(`SELECT count(*) as total FROM ${TBL_NEWS} nw JOIN ${TBL_TAGING} tg on nw.NewsID = tg.NewsID WHERE tg.TagID = ${id}`);
    return rows[0].total;
  },
  SearchNews: function (text, limit, offset) {
    return db.load(`SELECT news.*, catgroup.CatName FROM ${TBL_NEWS} JOIN ${VW_CatGroup} ON news.CatID = catgroup.CatID WHERE MATCH (news.Title,news.TinyDes,news.FullDes) AGAINST ('${text}' IN NATURAL LANGUAGE MODE) LIMIT ${limit} OFFSET ${offset}`);
  },
  CountSearch: async function (text) {
    const rows = await db.load(`SELECT count(*) as total FROM ${TBL_NEWS} JOIN ${VW_CatGroup} ON news.CatID = catgroup.CatID WHERE MATCH (news.Title,news.TinyDes,news.FullDes) AGAINST ('${text}' IN NATURAL LANGUAGE MODE)`);
    return rows[0].total;
  },
  allbyCat: function (id,limit, offset) {
    return db.load(`select nw.*,cn.CatName,cn.SonName from ${TBL_NEWS} nw join ${VW_CatFamily} cn on nw.CatID = cn.SonID Where nw.CatID in (SELECT cat.SonID FROM ${VW_CatFamily} cat where cat.CatID = ${id}) or nw.CatID = ${id} and nw.StatusID = 2 LIMIT ${limit} OFFSET ${offset}`);
  },
  countbyCat: async function (id) {
    const rows = await db.load(`select count(*) as total from ${TBL_NEWS} nw join ${VW_CatFamily} cn on nw.CatID = cn.SonID Where nw.CatID in (SELECT cat.SonID FROM ${VW_CatFamily} cat where cat.CatID = ${id}) or nw.CatID = ${id} and nw.StatusID = 2`);
    return rows[0].total;
  },
  MostInterested: function () {
    return db.load(`SELECT nw.*, cat.CatName FROM ${TBL_NEWS} nw join ${VW_CatGroup} cat on nw.CatID = cat.CatID WHERE DATEDIFF(NOW(),nw.ReleaseDate)<7 AND nw.StatusID = 2 ORDER BY nw.Views DESC LIMIT 4`);//them comment sau
  },
  MostView: function () {
    return db.load(`SELECT nw.*, cat.CatName FROM ${TBL_NEWS} nw join ${VW_CatGroup} cat on nw.CatID = cat.CatID WHERE nw.StatusID = 2 ORDER BY nw.Views DESC LIMIT 10`);
  },
  Newest: function () {
    return db.load(`SELECT nw.*, cat.CatName FROM ${TBL_NEWS} nw join ${VW_CatGroup} cat on nw.CatID = cat.CatID WHERE nw.StatusID = 2 ORDER BY nw.ReleaseDate DESC LIMIT 10`);
  },
  MostInterested_in_Category: function () {
    return db.load(`SELECT nw.*, cat.CatName FROM ${TBL_NEWS} nw join ${VW_CatGroup} cat on nw.CatID = cat.CatID WHERE DATEDIFF(NOW(),nw.ReleaseDate)<7 AND nw.StatusID = 2 GROUP by nw.CatID ORDER BY Views DESC LIMIT 10`);//them comment sau
  },
  WriterName: function (id) {
    const rows = db.load(`select us.FullName,us.Pseudonym from ${TBL_NEWS} nw join ${TBL_User} us on nw.Writer = us.UserID WHERE nw.NewsID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  allWithWriter: function (id) {
    return db.load(`
    select bv.*, us.FullName, us.Pseudonym
    from (select nw.NewsID, nw.Title, nw.TinyDes, nw.LastEdit,nw.ReleaseDate, nw.isPremium ,nw.Writer,nw.IMG, nw.Issue, nw.StatusID,st.StaName, cat.CatName , cat.CatParent
          from ${TBL_NEWS} nw, ${TBL_Status} st, (SELECT d1.CatID,d2.CatName as CatParent,d1.CatName 
          FROM ${TBL_CATEGORIES} d1 LEFT JOIN ${TBL_CATEGORIES} d2 ON d1.ParentID=d2.CatID 
          ORDER BY CatName) cat 
          where nw.StatusID = st.StaID and cat.CatID = nw.CatID and nw.isDelete = 0) as bv 
        join ${TBL_User} us on bv.Writer = us.UserID 
    where us.UserID = ${id}
    order by FIELD(bv.StatusID,3,4,1,2), bv.LastEdit DESC
    `);
  },
  allWithCat: function (id) {
    return db.load(`select nw.*, st.StaName from (select nw.*,pc.CatName,pc.ParentName,pc.UserID from ${VW_News_Writer} nw join ${VW_listnew_editor} pc on nw.CatID = pc.CatID where pc.UserID = ${id}) as nw join ${TBL_Status} st on st.StaID = nw.StatusID ORDER BY FIELD(nw.StatusID,4,3,1,2), nw.LastEdit DESC`);
  },
  allWithSameCat: function (catid, newsid) {
    return db.load(`SELECT nw.*, cat.CatName FROM ${TBL_NEWS} nw join ${VW_CatGroup} cat on nw.CatID = cat.CatID WHERE nw.StatusID = 2 and nw.CatID = ${catid} and nw.NewsID != ${newsid}  GROUP by nw.CatID ORDER BY RAND(), Views DESC LIMIT 5`);
  },
  single: async function (id) {
    const rows = await db.load(`select nw.*, cat.CatName, cat.CatParent, cat.ParentID ,(select st.StaName from status st where nw.StatusID = st.StaID) as State from ${TBL_NEWS} nw join (SELECT d1.CatID,d2.CatName as CatParent,d1.ParentID,d1.CatName 
                                                                      FROM ${TBL_CATEGORIES} d1 LEFT JOIN ${TBL_CATEGORIES} d2 ON d1.ParentID=d2.CatID 
                                                                      ORDER BY CatName) cat on nw.CatID = cat.CatID 
      where nw.NewsID = ${id}`);
    if (rows.length === 0)
      return null;
    // console.log(rows);
    return rows[0];
  },
  add: function (entity) {
    return db.add(TBL_NEWS, entity);
  },
  patch: function (entity) {
    const condition = {
      NewsID: entity.NewsID
    }
    delete entity.NewsID;
    return db.patch(TBL_NEWS, entity, condition);
  },
  remove: function (id) {
    const condition = {
      NewsID: id
    }
    const entity = { isDelete: 1 };
    return db.patch(TBL_NEWS, entity, condition);
  },
  del: function (id) {
    const condition = {
      NewsID: id
    }
    return db.del(TBL_NEWS, condition);
  }
};

//(SELECT d1.CatID,IF(d1.ParentID IS null,d1.CatName,CONCAT_WS(" - ",d2.CatName,d1.CatName))as CatName 