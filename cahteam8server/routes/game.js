const express = require('express');
const crypto = require ('crypto');
const router = express.Router();
const {db} = require('../src/constants/database');
const {JOINED_GAME,JOINED_ROOM,GAME_CHAT,SUBMITTED_CARDS,JUDGED_CARDS,START_NEW_GAME} = require('../src/constants/events');

router.use(function checkLogin(req,res,next)
  {
    if(req.session.passport == undefined)
       res.redirect('/');
    else
    {
      next();
    }
  });

router.use(function getCurrentUserInfo(req,res,next){
    const gameId= parseInt(req.query.gameId);
    if(gameId == undefined || isNaN(gameId) || gameId < 1 )
       res.redirect(`/lobby`);
    else
    {
      res.locals.gameId = gameId;
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
          res.locals.currentUser = currentUser;
          next();
        }
      })
      .catch(function(error) {
      console.log("ERROR:",error);
      return res.send(error);
      });
    }
});

router.get('/',function getPlayers(req,res,next) {
      const getActivePlayersQuery = "SELECT player.player_id,player.username,gameplayer.game_id,gameplayer.player_number,gameplayer.score,gameplayer.status FROM player JOIN gameplayer ON gameplayer.player_id = player.player_id where game_id = $1 ORDER BY score DESC";
      const gamePlayers = [];
      var foundCurrentUser = false;
      var index;
      var prevRank = 1;
      db.any(getActivePlayersQuery,[res.locals.gameId])
      .then(function(activePlayers) {
          if(activePlayers == null) 
             res.redirect('/lobby');
          else
          {
             var prevScore = activePlayers[0].score;
             for(index = 0 ;index<4;index++)
             {
                const gamePlayer = new Object();
                if(index < activePlayers.length)
                {
      
                  if(activePlayers[index].player_id == res.locals.currentUser.playerId)
                  {
                     res.locals.currentUser.playerNumber = activePlayers[index].player_number;
                     foundCurrentUser = true;
                  }
                  gamePlayer.playerId = activePlayers[index].player_id;
                  gamePlayer.username = activePlayers[index].username;
                  gamePlayer.gameId = activePlayers[index].game_id;
                  gamePlayer.playerNumber = activePlayers[index].player_number;
                  gamePlayer.score = activePlayers[index].score;
                  if(gamePlayer.score < prevScore)
                  {
                     prevRank++;
                     prevScore = gamePlayer.score;  
                  }
                  gamePlayer.rank = prevRank;
                  gamePlayer.status = activePlayers[index].status;  
                }
                else
                {
                   gamePlayer.playerId = "";
                   gamePlayer.username = "";
                   gamePlayer.gameId=res.locals.gameId;
                   gamePlayer.playerNumber = "";
                   gamePlayer.score = "";
                   gamePlayer.rank = "";
                   gamePlayer.status = ""; 
                }
                gamePlayers[index] = gamePlayer;
             }
             if(foundCurrentUser == false)
                   res.redirect('/lobby');
             else
             {
               res.locals.gamePlayers = gamePlayers;
               next();
             }
         }
      })
      .catch(function(error) {
                 console.log("ERROR:",error);
                return res.send(error);
             }); 
});

router.get('/',function(req,res,next) {
res.render('game',{gameId:res.locals.gameId.toString(),currentUser:res.locals.currentUser,gamePlayers: res.locals.gamePlayers,JOINED_ROOM:JOINED_ROOM,JOINED_GAME:JOINED_GAME,GAME_CHAT:GAME_CHAT,SUBMITTED_CARDS:SUBMITTED_CARDS,JUDGED_CARDS:JUDGED_CARDS,START_NEW_GAME:START_NEW_GAME});
});
module.exports = router;
