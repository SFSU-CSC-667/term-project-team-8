const express = require('express');
const app = express();
const port    =   process.env.PORT || 3000;
const router = express.Router();
const pug = require('pug');
const home = require('./routes/home');
const lobby = require('./routes/lobby');
const game = require('./routes/game');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const passportConfig = require('./src/constants/passportConfig');
passportConfig.initPassport();

app.use(express.static('./public'));
app.set('view engine','pug');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
                        secret: 'cardsAgainstHumanity',
                        resave:false,
                        saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.set('port',port);
app.use('/',home);
app.use('/lobby',lobby);
app.use('/game',game);
app.listen(port, function () {
  console.log('cahteamserver8 listening on port',app.get('port'));
});
