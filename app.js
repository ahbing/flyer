const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const app = express();


const config = require('./config');
const redisClient = require('redis').createClient(config.redis_port, config.redis_host);
// const githubStrategyMiddleware = require('./middlewares/github_strategy');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.session_secret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.session_secret,
  store: new RedisStore({ client: redisClient, ttl: 3 * 24 * 60 * 60 }),
  resave: true,
  saveUninitialized: true,
}));


app.use(function(req, res, next) {
  res.flyer = {
    send: function(template, data, redirect='/') {
      if (req.api || req.xhr) {
        res.json(data);
      } else {
        if (template < 400) return res.redirect(redirect);
        if (template) return res.render(template, data);
        res.send(data);
      }
    }
  };
  next();
});

app.use(function(req, res, next) {
  if (req.originalUrl.indexOf('/api/') !== 0) {
    return next();
  }
  req.api = true;
  // @todo add authorization
  next();
});

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
