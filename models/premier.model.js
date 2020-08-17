const db = require('../utils/db');

const TBL_PREMIER = 'premierpass';
const TBL_USER = 'account';

module.exports = {
//   all: function () {
//     const rows = db.load(`select us.*,pr.ApplyingTime, pr.State from ${TBL_PREMIER} pr join ${TBL_USER} us on pr.UserID = us.UserID`);
//     if (rows.length === 0)
//       return null;
//     return rows;
//   },
  all: function () {
    const rows = db.load(`select *, IF(PremiumExpireTime > NOW(), "Còn hiệu lực", "Hết hạn") as State from ${TBL_USER} WHERE RoleID = 4`);
    if (rows.length === 0)
      return null;
    return rows;
  },

  add: function (entity) {
    return db.add(TBL_PREMIER, entity);
  },
  del: function (id) {
    const condition = {
        ID: id
      }
    return db.del(TBL_PREMIER, condition);
}
//   patch: function (entity) {
//     const condition = {
//       TagID: entity.TagID
//     }
//     delete entity.TagID;
//     return db.patch(TBL_TAGS, entity, condition);
//   },
//   del: function (id) {
//     const condition = {
//       TagID: id
//     }
//     return db.del(TBL_TAGS, condition);
//   }
};