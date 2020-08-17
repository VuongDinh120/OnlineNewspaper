const db = require('../utils/db');

const TBL_CATEGORY = 'catgroup';
const TBL_Assign = 'assignment';
const TBL_User = 'account';
const TBL_Status = 'status';
const VW_lisCat_editor = 'listnews_editor';

module.exports = {
    allCatAssign: function (id) {
        return db.load(`select * from ${VW_lisCat_editor} where UserID = ${id}`);
    },
    allEditor: function () {
        return db.load(`select us.*, count(asg.CatID) as NumCat from ${TBL_Assign} asg right join ${TBL_User} us on asg.UserID = us.UserID WHERE us.RoleID = 2 GROUP BY us.UserID`);
    },
    allAssign: function (id) {
        return db.load(`select cat.*, a.UserID,a.ID from ${TBL_Assign} a join ${TBL_CATEGORY} cat on a.CatID = cat.CatID where a.UserID = ${id}`);
    },
    single: async function (usid,catid) {
        const rows = await db.load(`select * from ${TBL_Assign} where CatID = ${catid} and UserID = ${usid}`);
        if (rows.length === 0)
          return null;
        return rows[0];
      },
    add: function (entity) {
        return db.add(TBL_Assign, entity);
    },
    patch: function (entity) {
        const condition = {
            ID: entity.ID
        }
        delete entity.CatID;
        return db.patch(TBL_Assign, entity, condition);
    },
    del: function (id) {
        const condition = {
            ID: id
          }
        return db.del(TBL_Assign, condition);
    }
}