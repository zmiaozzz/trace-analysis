var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var route_receive = require('./routes/receive');
var route_homepage = require('./routes/homepage');
var route_api = require('./routes/api');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secret',
  resave: true,
  name: 'trace_jinrong_58',
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, //过期时间设置(单位毫秒)
    path: '/',
    httpOnly: true,
    secure: false
  }
}));


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all('/api', function(req, res, next) {
  if (!req.session.user) {
    res.send({code:-1,message:'登录过期'});
  }
  next();
});

app.use('/api', route_api);
app.use('/', route_receive);
app.use('/', route_homepage);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('RequestPath Not Found');
  err.status = 404;
  next(err);
});


// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.stack);

    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;