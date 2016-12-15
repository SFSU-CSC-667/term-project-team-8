const express = require('express');
const crypto = require ('crypto');
const router = express.Router();
const pgp = require('pg-promise')();
const database = require('../constants/database');
const db = pgp(database.DATABASE_URL);

router.use(function checkLogin(req,res,next)
  {
    if(req.session.passport == undefined)
       res.redirect('/');
    else
    {
      next();
    }
  });

router.get('/',function(req,res,next) {
res.render('game',{player1:{rank:"1",username:"apatel3",score:"0"},
                  player2:{rank:"2",username:"apatel4",score:"0"},
                  player3:{rank:"3",username:"apatel5",score:"0"},
                  player4:{rank:"4",username:"apatel6",score:"0"}});
});
module.exports = router;
