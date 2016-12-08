const express = require('express');
const app = express();
const port    =   process.env.PORT || 3000;
const router = express.Router();
const pug = require('pug');
const model = require('./model');
const bodyParser = require('body-parser');

app.set('view engine','pug');
const path = require("path");
app.set('views',path.join("..",'views'));
app.use(express.static(path.join("..",'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//app.set('db',connect.db);
app.set('port',port);
app.use('/',model);
app.listen(port, function () {
  console.log('cahteamserver8 listening on port',app.get('port'));
});
