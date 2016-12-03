const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const pug = require('pug');
const connect = require('./core/connect.js');
const model = require('./models/model.js');
const bodyParser = require('body-parser');

app.set('view engine','pug');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('db',connect.db);
const data = model.getData(connect.db, 'Select * FROM items');


app.get('/hand',function(req,res) {
res.render('hand');
});

app.get('/login',function (req, res)
{
  res.render('login');
  //res.send(data.data);
});

app.get('/register',function (req, res)
{
  res.render('login');
  //res.send(data.data);
});

app.post('/login',function(req,res)
{
   res.json({
      email:req.body.email,
      password:req.body.password
   })
});

app.post('/register',function(req,res)
{
   res.json({
      email:req.body.email,
      password:req.body.password
   })
});

app.get('/data',function (req, res)
{
  res.send(data.data);
});

app.get('/',function(req,res)
{
  res.send("Success");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

