const db = require('../utils/db');

const TBL_CATEGORIES = 'baiviet';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  singleWithAllSecondNode: function () {
    return db.load(`
    select d1.ID, d1.TenDanhMuc, d2.TenDanhMuc as TenDanhMucCon
    from ${TBL_CATEGORIES} d1 join ${TBL_CATEGORIES} d2 on d1.ID = d2.DanhMucCha 
    order by d1.ID asc`);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_CATEGORIES} where ID = ${id}`);
  },
  add: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  patch: function (entity) {
    const condition = {
      ID: entity.CatID
    }
    delete entity.CatID;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  del: function (id) {
    const condition = {
      ID: id
    }
    return db.del(TBL_CATEGORIES, condition);
  }
};