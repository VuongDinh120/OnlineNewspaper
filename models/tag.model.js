const db = require('../utils/db');

const TBL_TAGS = 'tag';
const TBL_TAGING = 'taging';

module.exports = {
  all: function () {
    const rows = db.load(`select ta.*, count(tg.NewsID) as CountNews from ${TBL_TAGS} ta left join ${TBL_TAGING} tg on ta.TagID = tg.TagID GROUP BY ta.TagID`);
    if (rows.length === 0)
      return null;
    return rows;
  },
  allPermitTag: function () {
    return db.load(`select * from ${TBL_TAGS} where isPermited = 1`);
  },
  tagByname: async function (name) {
    const rows = await db.load(`select * from ${TBL_TAGS} where TagName = '${name}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  single: async function (id) {
    const rows = await db.load(`select * from ${TBL_TAGS} where TagID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  add: function (tag) {
    const entity = { TagName: tag };
    return db.add(TBL_TAGS, entity);
  },
  patch: function (entity) {
    const condition = {
      TagID: entity.TagID
    }
    delete entity.TagID;
    return db.patch(TBL_TAGS, entity, condition);
  },
  del: function (id) {
    const condition = {
      TagID: id
    }
    return db.del(TBL_TAGS, condition);
  }
};