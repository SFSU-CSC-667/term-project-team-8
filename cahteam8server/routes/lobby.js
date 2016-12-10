const express = require('express');
const crypto = require ('crypto');
const router = express.Router();
const pgp = require('pg-promise')();
const database = require('../constants/database');
const db = pgp(database.DATABASE_URL);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/',function(req,res,next) {
  const email = req.query.email;
  const password = req.query.password;
  if(password == undefined)
  {
     return res.redirect('/');
  }
  const encryptedPassword = new Buffer(password).toString('base64');
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

module.exports = router;
