const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const pug = require('pug');
const connect = require('./core/connect.js');
const model = require('./model/model.js');

app.set('db',connect.db);
const data = model.getData(connect.db);
app.get('/',function (req, res)
{
  res.send(data.data);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

