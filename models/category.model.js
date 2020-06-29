const db = require('../utils/db');

const TBL_CATEGORIES = 'danhmuc';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  allNameCat: function () {
    return db.load(`SELECT d1.CatID,IF(d1.DanhMucCha IS null,d1.TenDanhMuc,CONCAT_WS(" - ",d2.TenDanhMuc,d1.TenDanhMuc))as TenDanhMuc 
    FROM ${TBL_CATEGORIES} d1 LEFT JOIN ${TBL_CATEGORIES} d2 ON d1.DanhMucCha=d2.CatID 
    ORDER BY TenDanhMuc`);
  },
  allWithSecondNode: function () {
    return db.load(`
    select d1.CatID, d1.TenDanhMuc, d2.TenDanhMuc as TenDanhMucCon
    from ${TBL_CATEGORIES} d1 join ${TBL_CATEGORIES} d2 on d1.CatID = d2.DanhMucCha 
    order by d1.CatID asc`);
  },
  allWithOnlyFirstNode: function () {
    return db.load(`
    SELECT CatID, TenDanhMuc FROM ${TBL_CATEGORIES} WHERE DanhMucCha is null`);
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
