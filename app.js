const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.get('/', (req, res) => {
    res.render('index');
})





module.exports = app;
