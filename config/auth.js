
module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Mời bạn đăng nhập để xem chức năng này');
        res.redirect('/login');
    },
    ensureAuthenticatedAdmin: function (req, res, next) {
        console.log(req.user);
        if (req.isAuthenticated() && req.user.RoleName == 'admin') {
            return next();
        } else {
            res.redirect("/");
        }
    }
    //     forwardAuthenticated: function(req, res, next) {
    //       if (!req.isAuthenticated()) {
    //         return next();
    //       }
    //       res.redirect('/');
    //     }
};