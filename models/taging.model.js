const db = require('../utils/db');

const TBL_TAGING = 'taging';
const TBL_TAG = 'tag';
const VW_list_tag_taging = 'list_tag_taging';

module.exports = {
  allTagingNews: async function () {
    const rows = await db.load(`select * from ${VW_list_tag_taging}`);
    if (rows.length === 0)
      return null;
    return rows;
  },
  allByIDNews: async function (id) {
    const rows = await db.load(`select t.TagID, t.TagName from ${TBL_TAGING} tg join ${TBL_TAG} t on tg.TagID = t.TagID WHERE tg.NewsID=${id}`);
    if (rows.length === 0)
      return null;
    return rows;
  },
  single: function (id) {
    return db.load(`select * from ${TBL_TAGING} where TagID = ${id}`);
  },
  add: function (tag, news) {
    const entity = {
      TagID: tag,
      NewsID: news
    }
    return db.add(TBL_TAGING, entity);
  },
  patch: function (entity) {
    const condition = {
      TagID: entity.TagID
    }
    delete entity.CatID;
    return db.patch(TBL_TAGING, entity, condition);
  },
  delByNewsID: function (id) {
    const condition = {
      NewsID: id
    }
    return db.del(TBL_TAGING, condition);
  },
  delByTagID: function (id) {
    const condition = {
      TagID: id
    }
    return db.del(TBL_TAGING, condition);
  }
};