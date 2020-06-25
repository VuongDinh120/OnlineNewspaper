const db = require('../utils/db');

const TBL_CATEGORIES = 'danhmuc';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
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
