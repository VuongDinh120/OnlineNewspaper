const db = require('../utils/db');

const TBL_CATEGORIES = 'category';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  allNameCat: function () {
    return db.load(`SELECT d1.CatID,IF(d1.ParentID IS null,d1.CatName,CONCAT_WS(" - ",d2.CatName,d1.CatName))as CatName 
    FROM ${TBL_CATEGORIES} d1 LEFT JOIN ${TBL_CATEGORIES} d2 ON d1.ParentID=d2.CatID 
    ORDER BY CatName`);
  },
  allWithSecondNode: function () {
    return db.load(`
    select d1.CatID, d1.CatName, d2.CatName as Descendants
    from ${TBL_CATEGORIES} d1 join ${TBL_CATEGORIES} d2 on d1.CatID = d2.ParentID 
    order by d1.CatID asc`);
  },
  allWithOnlyFirstNode: function () {
    return db.load(`
    SELECT CatID, CatName FROM ${TBL_CATEGORIES} WHERE ParentID is null`);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_CATEGORIES} where CatID = ${id}`);
  },
  add: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  patch: function (entity) {
    const condition = {
      CatID: entity.CatID
    }
    delete entity.CatID;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  del: function (id) {
    const condition = {
      CatID: id
    }
    return db.del(TBL_CATEGORIES, condition);
  }
};
