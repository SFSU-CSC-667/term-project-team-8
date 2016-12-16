const express = require('express');
const Random = require('random-js');
const random = new Random(Random.engines.mt19937().autoSeed());
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

router.use(function getCurrentUser(req,res,next)
{
  const currentUserQuery =  `select * from player where email = $1`; 
 db.oneOrNone(currentUserQuery,[req.session.passport.user])
    .then(function(data) {
    if(data == null || data.length == 0)
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

router.use('/',function getJoinableGames(req,res,next){
    const joinableGameQuery = "select gameplayer.game_id ,Count(gameplayer.game_id) as numberofplayers FROM gameplayer GROUP BY game_id order by game_id ASC";
    const games = [];
    var gameIndex = 0;
    db.any(joinableGameQuery)
       .then(function(data) {
         if(data != null &&  data.length >0)
         {
            for(var index = 0; index <data.length; index++)
            {
               if(data[index].numberofplayers < 4)
                {
                  games[gameIndex] = data[index].game_id;
                  gameIndex++;
                }
            }
         }
        res.locals.games = games;
        next();    
      })
      .catch(function(error) {
             console.log("ERROR:",error);
             return res.send(error);
     });
});

router.get('/logOut',function(req,res){
req.logOut();
res.redirect('/');
});

router.post('/createGame',function (req,res,next){
  const score = parseInt(req.body.score);
  if (score == "" || isNaN(score) || score <= 0)
  {
    return res.redirect(`/lobby`);
  }
  const dealerPosition = random.integer(1,4);
  const createGameQuery = `INSERT INTO game(max_score,wait_time,turn_end_time,dealer_id) VALUES($1,$2,$3,$4) RETURNING game_id`;
  db.oneOrNone(createGameQuery,[score,0,0,dealerPosition],game=>game.game_id)
     .then(function(gameId) {
         res.redirect(`/lobby/joinGame?gameId=${gameId}`);
     })
     .catch(function(error) {
             console.log("ERROR:",error);
             return res.send(error);
     });
 });

router.get('/joinGame',function isValidGame(req,res,next) {
    const gameId = parseInt(req.query.gameId);
    if(gameId == undefined || isNaN(gameId) || gameId == "" || gameId < 1)
       res.redirect('/lobby');
    else
    {
       res.locals.gameId = gameId;
       const validGameQuery = `select game.game_id,COUNT(gameplayer.game_id) as numberofplayers FROM game left JOIN gameplayer on gameplayer.game_id = $1 where game.game_id = $1 group by game.game_id`;
       const games = [];
       var gameIndex = 0;
       db.oneOrNone(validGameQuery,[gameId])
         .then(function(data) {
          const playerNumber = parseInt(data.numberofplayers);
          if(data != null && playerNumber < 4)
          {
             res.locals.playerNumber = playerNumber + 1;
             next();
          }
          else
             res.redirect(`/lobby`);
      })
       .catch(function(error) {
             console.log("ERROR:",error);
             return res.send(error);
        });
     }
});

router.get('/joinGame',function alreadyJoinedRoom(req,res,next) {
    const alreadyMemberOfGameQuery = `select player_id from gameplayer where player_id=$1 AND game_id = $2`;
    db.oneOrNone(alreadyMemberOfGameQuery,[res.locals.playerId,res.locals.gameId])
    .then(function (data) {
         if(data == null || data.length == 0)
            next();
         else
            res.redirect(`/lobby`);
         })
         .catch(function(error) {
            console.log("ERROR:",error);
            return res.send(error);
         });
});

router.get('/joinGame',function(req,res,next) {
  const gameId = res.locals.gameId;
  const playerId = res.locals.playerId;
  const addPlayerQuery = `INSERT INTO gameplayer(player_id,game_id,player_number) VALUES($1,$2,$3)`;
  db.none(addPlayerQuery,[playerId,gameId,res.locals.playerNumber])
     .then(function () {
         res.redirect(`/game?gameId=${gameId}`);
     })
     .catch(function(error) {
         console.log("ERROR:",error);
         return res.send(error);
     });
});

router.get('/',function(req,res,next) {
  const email = req.query.email;
  const password = req.query.password;
  res.render('lobby',{email: email,password: password,leadershipBoard:res.locals.leadershipBoard,games: res.locals.games});
});

module.exports = router;
