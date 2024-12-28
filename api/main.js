const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.get('/api/main', (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + '/../public/main.html');
    } else {
        res.redirect('/index.html');
    }
});

module.exports = app;