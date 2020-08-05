const db = require('../utils/db');

const TBL_NEWS = 'news';
const TBL_CATEGORIES = 'category';
const TBL_User = 'account';
const TBL_Status = 'status';
const VW_listnew_editor = 'listnews_editor';
const VW_News_Writer = 'news_with_writer';
module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_NEWS}`);
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
  single: function (id) {
    return db.load(`select nw.*, cat.CatName, cat.CatParent, (select st.StaName from status st where nw.StatusID = st.StaID) as State from ${TBL_NEWS} nw join (SELECT d1.CatID,d2.CatName as CatParent,d1.CatName 
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