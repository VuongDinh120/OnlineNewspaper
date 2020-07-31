const db = require('../utils/db');

const TBL_USER = 'account';
const TBL_ROLE = 'roles';

module.exports = {
  all: function () {
    return db.load(`SELECT us.UserID, us.UserName, us.FullName, us.PassWord, us.Pseudonym, us.Email, us.Avatar, rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.RoleID = rol.ID`);
  },
  singleByName: async function (UserName) {
    const rows = await db.load(`SELECT us.UserID, us.UserName, us.FullName, us.PassWord, us.Pseudonym, us.Email, us.Avatar, rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.RoleID = rol.ID where us.UserName = '${UserName}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleByID: async function (id) {
    const rows = await db.load(`SELECT us.UserID, us.UserName, us.FullName, us.PassWord, us.Pseudonym, us.Email, us.Avatar, us.BirthDay ,us.PremiumExpireTime,rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.RoleID = rol.ID where us.UserID = ${id}`);
    // console.log(rows[0]);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  add: function (entity) {
    return db.add(TBL_USER, entity);
  },
  patch: function (entity) {
    const condition = {
      UserID: entity.UserID
    }
    delete entity.UserID;
    return db.patch(TBL_USER, entity, condition);
  }
};
