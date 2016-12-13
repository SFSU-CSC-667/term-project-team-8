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

router.use(function authenticateUser(req,res,next) {
   const email = req.query.email;
   const password = req.query.password;
   const encryptedPassword = new Buffer(password).toString('base64');
   const authenticationQuery = `select * from player where email = $1  AND password = $2`;
  db.one(authenticationQuery,[email,encryptedPassword])
    .then(function(data) {
    if(data.length == 0)
     {
       return res.redirect('/');
     }
     else
     {
        res.locals.playerId=data.player_id;
        const currentUser = new Object();
        currentUser.playerId = data.player_id;
        currentUser.username = data.username;
        currentUser.score = data.score;
        currentUser.rank = "Fill me in";
        res.locals.currentUser = currentUser;
        next();
     }
     })
    .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });
});

router.use('/',function getLeadershipBoard(req,res,next) {
   const leadershipBoard = [];
   var prevRank = 1;
   const leadershipBoardQuery = "select * from player order by score DESC LIMIT 10";
   db.any(leadershipBoardQuery)
    .then(function(data) {
        var prevScore = data[0].score;
        for(index = 0; index < 10; index++)
        {
           leadershipBoard[index] = new Object();
           if(data[index] == undefined)
           {
              leadershipBoard[index].username = "";
              leadershipBoard[index].score = "";
              leadershipBoard[index].rank = "";
           }
           else
           {
              leadershipBoard[index].username = data[index].username;
              leadershipBoard[index].score = data[index].score;
              if(leadershipBoard[index].score <  prevScore)
              {
                 prevRank = prevRank+1;
                 prevScore = leadershipBoard[index].score;
              }
              leadershipBoard[index].rank = prevRank;
           }
        }
        res.locals.leadershipBoard = leadershipBoard;
        next();
     }) 
    .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });
});

router.use('/',function getCurrentUserRank(req,res,next) {
  const currentUserRankQuery = "select distinct score from player order by score DESC LIMIT 10";    
  db.any(currentUserRankQuery)
    .then(function(data) {
        for(index = 0; index <data.length; index++)
        {
          if(data[index].score == res.locals.currentUser.score)
            break;
        }
        res.locals.currentUser.rank = index+1;
        res.locals.leadershipBoard[10] = res.locals.currentUser;
        next();
     })
    .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
    });

});

router.use('/createRoom',function makeRoom(req,res,next){
  const score = parseInt(req.body.score);
  if (score == "" || isNaN(score) || score <= 0)
  {
    return res.redirect(`/lobby?email=${email}&password=${password}`);
  }
  const dealerPosition = random.integer(1,4);
  const createGameQuery = `INSERT INTO game(max_score,wait_time,turn_end_time,dealer_id) VALUES($1,$2,$3,$4) RETURNING game_id`;
  db.one(createGameQuery,[score,0,0,dealerPosition],game=>game.game_id)
     .then(function(gameId) {
         res.locals.gameId= gameId;
         next();
     })
     .catch(function(error) {
             console.log("ERROR:",error);
             return res.send(error);
     });
 });

router.post('/createRoom',function(req,res,next) {
  const gameId = res.locals.gameId;
  const playerId = res.locals.playerId;
  const email = req.query.email;
  const password = req.query.password;
  const score = parseInt(req.body.score);
  const addPlayerQuery = `INSERT INTO gameplayer(player_id,game_id,player_number) VALUES($1,$2,$3)`;
  db.none(addPlayerQuery,[playerId,gameId,1])
     .then(function () {
         res.redirect(`/game?email=${email}&password=${password}&gameId=${gameId}`);
     })
     .catch(function(error) {
         console.log("ERROR:",error);
         return res.send(error);
     });
});

router.get('/',function(req,res,next) {
  const email = req.query.email;
  const password = req.query.password;
  res.render('lobby',{email: email,password: password,leadershipBoard:res.locals.leadershipBoard});
});

module.exports = router;
