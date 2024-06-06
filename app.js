const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.get('/', (req, res) => {
    res.render('index');
})



module.exports = app;