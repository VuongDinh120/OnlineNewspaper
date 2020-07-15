const db = require('../utils/db');

const TBL_NEWS = 'news';
const TBL_CATEGORIES = 'category';
const TBL_User = 'account';
const TBL_Status = 'status';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_NEWS}`);
  },
  allWithWriter: function (id) {
    return db.load(`
    select bv.*
    from (select nw.NewsID, nw.Title, nw.TinyDes, nw.ReleaseDate, nw.Writer,nw.IMG, nw.Issue, st.StaName, cat.CatName , cat.CatParent
          from ${TBL_NEWS} nw, ${TBL_Status} st, (SELECT d1.CatID,d2.CatName as CatParent,d1.CatName 
          FROM ${TBL_CATEGORIES} d1 LEFT JOIN ${TBL_CATEGORIES} d2 ON d1.ParentID=d2.CatID 
          ORDER BY CatName) cat 
          where nw.StatusID = st.StaID and cat.CatID = nw.CatID) as bv 
        join ${TBL_User} us on bv.Writer = ${id}
    `);
  },
  single: function (id) {
    return db.load(`select nw.*, cat.CatName, cat.CatParent from ${TBL_NEWS} nw join (SELECT d1.CatID,d2.CatName as CatParent,d1.CatName 
                                                                      FROM ${TBL_CATEGORIES} d1 LEFT JOIN ${TBL_CATEGORIES} d2 ON d1.ParentID=d2.CatID 
                                                                      ORDER BY CatName) cat on nw.CatID = cat.CatID 
      where nw.NewsID = ${id}`);
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
  del: function (id) {
    const condition = {
      NewsID: id
    }
    return db.del(TBL_NEWS, condition);
  }
};

//(SELECT d1.CatID,IF(d1.ParentID IS null,d1.CatName,CONCAT_WS(" - ",d2.CatName,d1.CatName))as CatName 