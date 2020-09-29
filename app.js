// ENV VARIABLES
require("dotenv").config();

// DATABASE CONNECTION
require("./config/mongodb");

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const hbs = require("hbs");


// const mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


var app = express();

// view engine setup
app.use(express.static(__dirname + "/public"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + "/views/partials");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
  );

app.use(flash());

app.use(require("./middleware/exposeFlashMessage.js"))


app.use('/', indexRouter);
app.use('/signup', authRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// BODY PARSER HERE:
// below mandatory to expose the posted data in req.body (sync)
app.use(express.urlencoded({ extended: false }));
// below mandatory to expose the posted data in req.body (async => AJAX)
app.use(express.json());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// ROUTES
// INSERT ROUTES HERE



module.exports = app;
