const db = require('../utils/db');

const TBL_NEWS = 'news';
const TBL_CATEGORIES = 'category';
const TBL_User = 'account';
const TBL_Status = 'status';
const VW_lisCat_editor = 'listnews_editor';

module.exports = {
    allCatAssign: function (id) {
        return db.load(`select * from ${VW_lisCat_editor} where UserID = ${id}`);
    },
}