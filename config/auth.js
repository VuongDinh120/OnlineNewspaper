
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Mời bạn đăng nhập để xem chức năng này');
        res.redirect('/login');
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }
    ,
    ensureAuthenticatedAdmin: function (req, res, next) {
        console.log(req.user);
        if (req.isAuthenticated() && req.user.RoleID == 1) {
            return next();
        } else {
            res.redirect("/");
        }
    },
    ensureAuthenticatedWriter: function (req, res, next) {
        console.log(req.user);
        if (req.isAuthenticated() && req.user.RoleID == 3) {
            return next();
        } else {
            res.redirect("/");
        }
    },
    ensureAuthenticatedEditor: function (req, res, next) {
        console.log(req.user);
        if (req.isAuthenticated() && req.user.RoleID == 2) {
            return next();
        } else {
            res.redirect("/");
        }
    }

};