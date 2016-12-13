const express = require('express');
const crypto = require ('crypto');
const router = express.Router();
const pgp = require('pg-promise')();
const database = require('../constants/database');
const db = pgp(database.DATABASE_URL);

function checkNonEmptyFields(req,res,next)
{
   const username = req.body.email;
   const password = req.body.password;
   const email = req.body.email;
   if(username == "" || password == "" || email =="")
   {
      return res.redirect('/');
   }
   else
   {
      next();
   }
}

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.use('/register',checkNonEmptyFields);
router.use('/login',checkNonEmptyFields);

router.use('/register',function checkUniquePlayer(req,res,next)
{
  const username = req.body.email;
  const email = req.body.email;
  if(username == "" || email =="")
   {
      return res.redirect('/');
   }
   else
   {
     const checkQuery = `select * from player where email = $1  OR username = $2`;
     db.any(checkQuery,[email,username])
     .then(function(data) {
       if(data.length > 0)
       {
        res.redirect('/');
       }
      else 
      {
        next();
      }
      })
     .catch(function(error) {
         console.log("ERROR:",error);
         return res.send(error);
        });
   }
});

router.get('/hand',function(req,res,next) {
res.render('hand');
});

router.post('/login',function(req,res,next)
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

router.post('/register',function(req,res,next)
{
   const username = req.body.email;
   const rawPassword = req.body.password;
   const password = new Buffer(rawPassword).toString('base64');
   const email = req.body.email;
   const insertQuery = `INSERT INTO player (username,password,email) VALUES ($1,$2,$3)`;
   db.none(insertQuery,[username,password,email])
   .then(function() {
       return res.redirect(`/lobby?email=${email}&password=${rawPassword}`);
      })
   .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });
});

router.get('/',function(req,res)
{
  res.render('login');
});

module.exports = router;