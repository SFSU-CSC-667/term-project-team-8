const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const DATABASE_URL = process.env.DATABASE_URL || "postgres://qgjmjrvpnooxbd:-kllbSyNCkgI7aLHRg0RxlAOjv@ec2-23-23-222-147.compute-1.amazonaws.com:5432/d5kk4m3ru0nl0c?ssl=true";
console.log(DATABASE_URL);
const db = pgp(DATABASE_URL);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/hand',function(req,res,next) {
res.render('hand');
});

router.get('/data',function getData(req,res,next) {
const result = new Object();
db.any("select * from items") 
 .then(function(data) {
     console.log("DATA:",data);
     return res.send(data);
  })
  .catch(function(error) {
     console.log("ERROR:",error);
     return res.send(error);
  })
});

router.get('/login',function (req, res)
{
  res.render('login');
  //res.send(data.data);
});

router.get('/register',function (req, res)
{
  res.render('login');
  //res.send(data.data);
});


router.post('/login',function(req,res)
{
   res.json({
      email:req.body.email,
      password:req.body.password
   })
});

router.post('/register',function(req,res)
{
   const username = req.body.email;
   const password = req.body.password;
   const email = req.body.email;
   const queryString = `INSERT INTO player (username,password,email) VALUES (\'${username}\','${password}\',\'${email}\')`;
 console.log(queryString);  
 db.none(queryString,[true])
 .then(function() {
     console.log("QueryString:",queryString);
     return res.json({
      email:req.body.email,
      password:req.body.password
   })
  })
  .catch(function(error) {
     console.log("ERROR:",error);
     return res.send(error);
  })
});

router.get('/',function(req,res)
{
  res.send('Success');
});

module.exports = router;
