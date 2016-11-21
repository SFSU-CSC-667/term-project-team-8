var express = require('express');
var app = express();
const pgp = require('pg-promise')();
const connect = require('./core/connect.js');
const model = require('./model/model.js');

app.set('db',connect.db);

app.get('/',function (req, res)
{
  model.getData(req,res);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

