const express = require('express');
const crypto = require ('crypto');
const Random = require('random-js');
const random = new Random(Random.engines.mt19937().autoSeed());
const router = express.Router();
const pgp = require('pg-promise')();
const database = require('../constants/database');
const db = pgp(database.DATABASE_URL);

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/createRoom',function(req,res,next) {
  const email = req.query.email;
  const password = req.query.password;
  const score = parseInt(req.body.score);
  if(password == undefined)
  {
     return res.redirect('/');
  }
  else if (score == "" || isNaN(score) || score <= 0)
  {
    return res.redirect(`/lobby?email=${email}&password=${password}`);
  }
  const encryptedPassword = new Buffer(password).toString('base64');
  const authenticationQuery = `select * from player where email = $1  AND password = $2`;
  db.any(authenticationQuery,[email,encryptedPassword]).then(function(data) {
    if(data.length == 0)
     {
       return res.redirect('/');
     }
     const dealerPosition = random.integer(1,4);
     const createGameQuery = `INSERT INTO game(max_score,wait_time,turn_end_time,dealer_id) VALUES($1,$2,$3,$4) RETURNING game_id`;
     db.one(createGameQuery,[score,0,0,dealerPosition],game=>game.game_id)
       .then(function(gameId) {
           const addPlayerQuery = `INSERT INTO gameplayer(player_id,game_id,player_number) VALUES($1,$2,$3)`;
           db.none(addPlayerQuery,[8,gameId,1])
             .then(function () {
             res.redirect(`/game?email=${email}&password=${password}&gameId=${gameId}`);
            })
             .catch(function(error) {
               console.log("ERROR:",error);
               return res.send(error);
             });
        })
       .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });
  })
    .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });
});

router.get('/',function(req,res,next) {
  const email = req.query.email;
  const password = req.query.password;
  if(password == undefined)
  {
     return res.redirect('/');
  }
  const encryptedPassword = new Buffer(password).toString('base64');
  const authenticationQuery = `select * from player where email = $1  AND password = $2`;
  db.any(authenticationQuery,[email,encryptedPassword]).then(function(data) {
  if(data.length == 0)
     return res.redirect('/');
     else
     {
       res.render('lobby',{email: email,password: password});
     }
  })
  .catch(function(error) {
     console.log("ERROR:",error);
     return res.send(error);
  });
});

module.exports = router;
