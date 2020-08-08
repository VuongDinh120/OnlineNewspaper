const db = require('../utils/db');

const TBL_NEWS = 'news';
const TBL_CATEGORIES = 'category';
const TBL_User = 'account';
const TBL_Status = 'status';
const TBL_Comment = 'comment';

module.exports = {
    allByNews: function (id) {
        return db.load(`select cm.*,us.FullName, us.Avatar from ${TBL_Comment} cm join ${TBL_User} us on cm.UserID = us.UserID  WHERE cm.NewsID = ${id}`);
    },
    add: function (entity) {
        return db.add(TBL_Comment, entity);
    },
}