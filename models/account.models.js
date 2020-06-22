const db = require('../utils/db');

const TBL_USER = 'account';
const TBL_ROLE = 'roles';

module.exports = {
  all: function () {
    return db.load(`SELECT us.ID, us.TenTaiKhoan, us.HoTen, us.MatKhau, us.ButDanh, us.Email, us.Avatar, rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.ROLE = rol.ID`);
  },
  singleByName: async function (TenTaiKhoan) {
    const rows = await db.load(`SELECT us.ID, us.TenTaiKhoan, us.HoTen, us.MatKhau, us.ButDanh, us.Email, us.Avatar, rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.ROLE = rol.ID where us.TenTaiKhoan = '${TenTaiKhoan}'`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  singleByID: async function (id) {
    const rows = await db.load(`SELECT us.ID, us.TenTaiKhoan, us.HoTen, us.MatKhau, us.ButDanh, us.Email, us.IMG, rol.RoleName FROM ${TBL_USER} us join ${TBL_ROLE} rol on us.ROLE = rol.ID where us.ID = ${id}`);
    if (rows.length === 0)
      return null;
    return rows[0];
  },
  add: function (entity) {
    return db.add(TBL_USER, entity);
  },
  patch: function (entity) {
    const condition = {
      TenTaiKhoan: entity.TenTaiKhoan
    }
    delete entity.TenTaiKhoan;
    return db.patch(TBL_USER, entity, condition);
  }
};
