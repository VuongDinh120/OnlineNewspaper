const db = require('../utils/db');

const TBL_CATEGORIES = 'category';
const VW_CATEGORIES = 'catgroup';
const VW_catfamily = 'catfamily';
const VW_CatOnlySon = 'catonlyson'
module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  allNameCat: function () {
    return db.load(`SELECT * FROM ${VW_CATEGORIES}`);
  },
  allWithSecondNode: function () {
    return db.load(`
    select d1.CatID, d1.CatName, d2.CatName as Descendants
    from ${TBL_CATEGORIES} d1 join ${TBL_CATEGORIES} d2 on d1.CatID = d2.ParentID 
    order by d1.CatID asc`);
  },
  allWithOnlyFirstNode: function () {
    return db.load(`SELECT CatID, CatName FROM ${TBL_CATEGORIES} WHERE ParentID is null`);
  },
  getSonCat: function (id) {
    const rows = db.load(`select CatID, CatName, ParentID from ${VW_CatOnlySon} where ParentID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows;
  },
  getfatherCat: async function (id) {
    const rows = await db.load(`select CatID,CatName from ${VW_catfamily} where SonID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  getCatName: async function (id) {
    const rows = await db.load(`select CatID,CatName from ${TBL_CATEGORIES} where CatID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  single: async function (id) {
    const rows = await db.load(`select * from ${TBL_CATEGORIES} where CatID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows[0];
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
