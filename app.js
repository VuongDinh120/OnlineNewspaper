const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
let flash = require('express-flash');
const app = express();

app.use(session({
    secret: "cats",
    cookie: {
        maxAge: 1000 * 50 * 5
    },
    resave: true,
    saveUninitialized: false
}));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.engine('hbs', exphbs({
    layoutsDir: 'views/_layouts',
    defaultLayout: 'main',
    partialsDir: 'views/_partials',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use('/public', express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));


app.use(function (req, res) {
    res.render('404');
});

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
})
