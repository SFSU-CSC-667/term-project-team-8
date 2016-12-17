const express = require('express');
const router = express.Router();
const {db} = require('../src/constants/database');
const passport = require('passport');

function checkNonEmptyFields(req,res,next)
{
   const username = req.body.username;
   const password = req.body.password;
   const email = req.body.email;
   if(username == "" || email =="" || password == "")
   {
      return res.redirect('/');
   }
   else
    return next();
}

router.use('/register',checkNonEmptyFields);
//router.use('/login',checkNonEmptyFields);

router.use('/register',function checkUniquePlayer(req,res,next)
{
  const username = req.body.email;
  const email = req.body.email;
  const checkQuery = `select * from player where email = $1  OR username = $2`;
  db.oneOrNone(checkQuery,[email,username])
  .then(function(data) {
     if(data != null)
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
});

router.get('/hand',function(req,res,next) {
res.render('hand');
});

router.post('/login', passport.authenticate('local', 
{ successRedirect: '/lobby',failureRedirect: '/' }));

router.post('/register',function(req,res,next)
{
   const email = req.body.email;
   const username = req.body.username;
   const password = req.body.password;
   const encryptedPassword = new Buffer(password).toString('base64');
   const insertQuery = `INSERT INTO player (username,password,email) VALUES ($1,$2,$3)`;
   db.none(insertQuery,[username,encryptedPassword,email])
   .then(function() {
          next();
      })
   .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });
}, passport.authenticate('local',
{ successRedirect: '/lobby',failureRedirect: '/' }));

router.get('/',function(req,res)
{
  res.render('home');
});

module.exports = router;
