const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

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
app.engine('hbs', exphbs({
    layoutsDir: 'views/_layouts',
    defaultLayout: 'main',
    //partialsDir: 'views/_partials',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');


app.use('/public', express.static('public'));

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
})
