const express = require('express');
const crypto = require ('crypto');
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

router.get('/lobby',function(req,res,next) {
  const email = req.query.email;
  const password = req.query.password;
  const encryptedPassword = new Buffer(password).toString('base64');
  console.log(req.query);
  const query = `select * from player where email = \'${email}\'  AND password = \'${encryptedPassword}\'`;
     console.log(query);
     db.any(query) .then(function(data) {
     if(data.length == 0)
        res.redirect('/');
     else
     {
       res.render('lobby');
     }
  })
  .catch(function(error) {
     console.log("ERROR:",error);
     return res.send(error);
  })
});

router.post('/login',function(req,res)
{
   const email = req.body.email;
   const password = req.body.password;
   if(email == "")
     res.redirect('/');
   else
   {
      res.redirect(`/lobby?email=${email}&password=${password}`);
  }
});

router.post('/register',function(req,res)
{
   const username = req.body.email;
   const rawPassword = req.body.password;
   const password = new Buffer(rawPassword).toString('base64');
   const email = req.body.email;
   if(username == "" || password == "" || email =="")
      res.redirect('/');
   else
   {
       const checkQuery = `select * from player where email = \'${email}\'  OR username = \'${username}\'`;
       console.log(checkQuery);
       db.any(checkQuery) .then(function(data) {
       if(data.length == 0)
       {
         const insertQuery = `INSERT INTO player (username,password,email) VALUES (\'${username}\','${password}\',\'${email}\')`;
         console.log(insertQuery);
        db.none(insertQuery,[true])
        .then(function() {
        res.redirect(`/lobby?email=${email}&password=${rawPassword}`);
        })
        .catch(function(error) {
        console.log("ERROR:",error);
        return res.send(error);
        })
      }
     else
        res.redirect('/');
  })
  .catch(function(error) {
     console.log("ERROR:",error);
     return res.send(error);
  })
         
   }
});

router.get('/',function(req,res)
{
  res.render('login');
});

module.exports = router;
