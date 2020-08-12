const db = require('../utils/db');

const TBL_NEWS = 'news';
const TBL_CATEGORIES = 'category';
const VW_CATEGORIES = 'catgroup';
const VW_catfamily = 'catfamily';
const VW_CatOnlySon = 'catonlyson'
module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  allfisrt: function () {
    return db.load(`select tb1.CatID, tb1.CatName , count(tb1.NewsID) as countNews
                   from (select c1.CatID, C1.CatName,nw1.NewsID from ${VW_catfamily} c1 join ${TBL_NEWS} nw1 on c1.SonID = nw1.CatID
                UNION select c2.CatID, C2.CatName,nw2.NewsID from ${TBL_CATEGORIES} c2 left join ${TBL_NEWS} nw2 on c2.CatID = nw2.CatID where c2.ParentID is null )as tb1 GROUP BY tb1.CatID`);
  },
  allsecond: function () {
    return db.load(`select c1.*, c2.CatName as ParentName, count(nw.NewsID) as countNews from ${TBL_CATEGORIES} c1 left join ${TBL_CATEGORIES} c2 on c1.ParentID = c2.CatID left join ${TBL_NEWS} nw on c1.CatID = nw.CatID where c1.ParentID is not null GROUP BY c1.CatID`);
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
  catByName: async function (name, id) {
    let rows;
    if (id === null)
      rows = await db.load(`select * from ${TBL_CATEGORIES} where CatName = '${name}' and ParentID is null`);
    else
      rows = await db.load(`select * from ${TBL_CATEGORIES} where CatName = '${name}' and ParentID = ${id}`);

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
