const express = require('express');
const path = require('path');
const favicon = require( 'serve-favicon' );
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const pug = require('pug');
const passport = require('passport');

const passportConfig = require('./src/constants/passportConfig');
const home = require('./routes/home');
const lobby = require('./routes/lobby');
const game = require('./routes/game');

passportConfig.initPassport();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
                         secret: 'cardsAgainstHumanity',
                         resave:false,
                         saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/',home);
app.use('/lobby',lobby);
app.use('/game',game);

app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message);
})

module.exports = app
