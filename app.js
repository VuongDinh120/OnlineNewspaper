const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
let flash = require('express-flash');

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '/public')));

require('./middlewares/session.mdw')(app);
require('./middlewares/view.mdw')(app);


app.use('/', require('./routers/home.route'));
app.use('/writer', require('./routers/writer.route'));
app.use('/account', require('./routers/user.route'));



app.use(function (req, res) {
    res.render('404');
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);

})
