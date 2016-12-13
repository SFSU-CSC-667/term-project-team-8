const express = require('express');
const app = express();
const port    =   process.env.PORT || 3000;
const router = express.Router();
const pug = require('pug');
const home = require('./routes/home');
const lobby = require('./routes/lobby');
const game = require('./routes/game');
const bodyParser = require('body-parser');

app.set('view engine','pug');
const path = require("path");
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('port',port);
app.use('/',home);
app.use('/lobby',lobby);
app.use('/game',game);
app.listen(port, function () {
  console.log('cahteamserver8 listening on port',app.get('port'));
});
