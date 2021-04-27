var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileupload = require('express-fileupload')
const session = require('express-session');
var MemoryStore = require('memorystore')(session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var transactionRouter = require('./routes/transaction');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload({
  createParentPath: true,
  safeFileNames: true
}));

app.use(session({
  cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
	secret: 'testing',
	resave: true,
	saveUninitialized: true
}));

// app.use(function (req, res, next){
//   // console.log(req.sessionID);
//   next();
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/data', transactionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('dev/error');
});

app.listen(5000, function(){
  console.log('Running')
})




module.exports = app;
