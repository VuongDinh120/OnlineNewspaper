const db = require('../utils/db');

const TBL_NEWS = 'baiviet';
const TBL_CATEGORIES = 'danhmuc';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_NEWS}`);
  },
  allWithCatID: function () {
    return db.load(`
    select 
    from ${TBL_NEWS} bv left join ${TBL_CATEGORIES} dm on bv.DanhMuc_ID = dm.CatID
    where dm.`);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_NEWS} where ID = ${id}`);
  },
  add: function (entity) {
    return db.add(TBL_NEWS, entity);
  },
  patch: function (entity) {
    const condition = {
      ID: entity.CatID
    }
    delete entity.CatID;
    return db.patch(TBL_NEWS, entity, condition);
  },
  del: function (id) {
    const condition = {
      ID: id
    }
    return db.del(TBL_NEWS, condition);
  }
};