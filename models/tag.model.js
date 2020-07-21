const db = require('../utils/db');

const TBL_TAGS = 'tag';

module.exports = {
  all: function () {
    return db.load(`select * from ${TBL_TAGS}`);
  },
  allPermitTag: function () {
    return db.load(`select * from ${TBL_TAGS} where isPermited = 1`);
  },
  single: function (id) {
    return db.load(`select * from ${TBL_TAGS} where TagID = ${id}`);
  },
  add: function (tag) {
    const entity = {TagName:tag};
    return db.add(TBL_TAGS, entity);
  },
  patch: function (entity) {
    const condition = {
      TagID: entity.TagID
    }
    delete entity.CatID;
    return db.patch(TBL_TAGS, entity, condition);
  },
  del: function (id) {
    const condition = {
      TagID: id
    }
    return db.del(TBL_TAGS, condition);
  }
};