const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Session and flash middleware
app.use(session({
    secret: 'your_secret_key', // replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
});

// Importing routes
const userRouter = require("./routes/user.routes.js");
const bookRouter = require("./routes/book.routes.js");
const pagesRouter = require("./routes/pages.routes.js");
const blogRouter = require("./routes/blog.routes.js");
// Routes
app.use('/', pagesRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/blogs", blogRouter);

module.exports = app;