const db = require('../utils/db');

const TBL_USER = 'account';
const TBL_ROLE = 'roles';
const TBL_NEWS = 'news';

module.exports = {
  all: function () {
    return db.load(`SELECT us.UserID, us.UserName, us.FullName, us.PassWord, us.Pseudonym, us.Email, us.Avatar, rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.RoleID = rol.ID`);
  },
  singleByName: async function (UserName) {
    const rows = await db.load(`SELECT us.UserID, us.UserName, us.FullName, us.PassWord, us.Pseudonym, us.Email, us.Avatar, rol.ID ,rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.RoleID = rol.ID where us.UserName = '${UserName}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleByID: async function (id) {
    const rows = await db.load(`SELECT us.UserID, us.UserName, us.FullName, us.PassWord, us.Pseudonym, us.Email, us.Avatar, us.BirthDay ,us.PremiumExpireTime,rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.RoleID = rol.ID where us.UserID = ${id}`);

    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleSesByID: async function (id) {
    const rows = await db.load(`SELECT us.UserID, us.UserName, us.FullName, us.Pseudonym, us.Email, us.Avatar, us.RoleID ,rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.RoleID = rol.ID where us.UserID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  checkEmail: async function (email) {
    const rows = await db.load(`SELECT UserID, UserName, Email  FROM ${TBL_USER} WHERE Email = '${email}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleByNews: async function (id) {
    const rows = await db.load(`SELECT us.UserID, us.UserName, us.FullName, us.PassWord, us.Pseudonym, us.Email, us.Avatar, us.BirthDay ,us.PremiumExpireTime FROM ${TBL_USER} us join ${TBL_NEWS} nw on us.UserID = nw.Writer where nw.NewsID = ${id} LIMIT 1`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleByToken: async function (token) {
    const rows = await db.load(`SELECT UserID, ResetPasswordExpireTime FROM ${TBL_USER} WHERE ResetPasswordToken = '${token}'`);
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
  },
  patchByEmai: function (entity) {
    const condition = {
      Email: entity.Email
    }
    delete entity.Email;
    return db.patch(TBL_USER, entity, condition);
  },
};
