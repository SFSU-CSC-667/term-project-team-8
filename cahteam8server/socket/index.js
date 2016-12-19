const socketIo = require( 'socket.io' );
const {db} = require('../src/constants/database');
const {LOBBY_CHAT,JOINED_LOBBY,JOINED_GAME,JOINED_ROOM,GAME_CHAT,USER_JOINED, MESSAGE_SEND,SUBMITTED_CARDS,JUDGED_CARDS,START_NEW_GAME} = require( '../src/constants/events' );
const init = ( app, server ) => {
  const io = socketIo(server);
  app.set('io',io);
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
    console.log('user disconnected');
    });

   socket.on(LOBBY_CHAT, function(msg){
    io.emit(LOBBY_CHAT,msg);
      console.log('message: ' + msg);
    });

   socket.on(JOINED_ROOM,getUserCount);
   socket.on(JOINED_GAME, function(message)
   {
      console.log("JOINED GAME");
      console.log("User count = " + message.msg);
      io.sockets.in(message.gameId).emit(JOINED_GAME,JOINED_GAME);
   }); 
   
   socket.on(START_NEW_GAME,dealHand);
 
   socket.on(GAME_CHAT, function(message){
   
    io.sockets.in(message.gameId).emit(GAME_CHAT,message);
      console.log('game message: ' + message.msg);
    });

   function dealHand(message)
   {
      const hand = [];
      const whiteCardIds = [];
      const gameId = parseInt(message.gameId);
      const getAvailableWhiteCardsQuery = "select whitedeck.wcid,whitedeck.wcvalue from whitedeck inner join whitecards on whitecards.wcid = whitedeck.wcid where game_id = $1 and status = $2  limit 10";
      db.any(getAvailableWhiteCardsQuery,[gameId,0]).
      then(function (cards) {
          for(var index = 0; index<10; index++)
          {
             hand[index] = cards[index].wcvalue;
             whiteCardIds[index] = cards[index].wcid;
          }
          message.hand = hand;
          message.whiteCardIds = whiteCardIds;
          markHand(message);
      })
      .catch(function(error)
      {
         console.log("Beginning marks the spot.");
         console.log("ERROR:", error);
      });
   }

   function markHand(message)
   {
      for(var i = 0; i < 10; i++)
      {
         const updateWhiteCardsQuery = "update whitecards set status = $1 ,player_id = $2 where game_id = $3 and wcid= $4";
         db.none(updateWhiteCardsQuery,[1,message.playerId,parseInt(message.gameId),message.whiteCardIds[i]]).
         then(function () {})
         .catch(function(error)
         {
            console.log("Caught the problem. at markHand");
            console.log("ERROR:",error);
         });
      }
      message.dealerId = 0;
      message.blackCard="";
      const gameInfo = getGameInfo(message);
      console.log("Game Info: %j",gameInfo);
      message.dealerId = gameInfo.dealerId;
      message.maxScore = gameInfo.maxScore;
      if(message.dealerId.toString() === message.playerNumber.toString())
       {
          const blackCard = dealBlackCard(message);
          message.blackCard = blackCard.blackCard;
          message.blackCardId = blackCard.bcid;
       }
       console.log("%j",message);
       io.sockets.in(message.gameId).emit(START_NEW_GAME,message);
       //socket.broadcast.to(message.gameId.toString()).emit(START_NEW_GAME,message);
   }

   function dealBlackCard(message)
   {  
      const getBlackCardQuery = "select blackdeck.bcid,blackdeck.bcvalue from blackdeck inner join blackcards on blackcards.bcid = blackdeck.bcid where game_id = $1 and status = $2 limit 1";
      db.one(getBlackCardQuery,[message.gameId,0]).
      then(function (blackCard) {
          message.blackCard = blackCard.bcvalue;
          message.blackCardId = blackCard.bcid;
         return  markBlackCard(message);
      })
      .catch(function(error)
      {
         console.log("ERROR:", error);
      });
   }

   function markBlackCard(message)
   {
      const blackCard = new Object();
      blackCard.blackCard = message.blackCard;
      blackCard.blackCardId = message.blackCardId;
      const updateBlackCardQuery = "update blackcards set status = $1, player_id = $2 where game_id = $3 and bcid = $4";
         db.none(updateBlackCardQuery,[1,message.playerId,parseInt(message.gameId),message.blackCardId]).
         then(function () {})
         .catch(function(error)
         {
            console.log("ERROR:",error);
         });
      return blackCard;
   }

   function getGameInfo(message)
   {
       const gameQuery = "select * from game where game_id = $1 limit 1";
       const gameId = parseInt(message.gameId);
       console.log("gameId = " + String(gameId));
       const gameInfo = []
       gameInfo.dealerId = 0;
       gameInfo.maxScore = 0;
       db.one(gameQuery,[gameId]).
         then(function (data)
         {
            gameInfo.dealerId = data.dealer_id;
            gameInfo.maxScore = data.max_score;
            return gameInfo;
            //onsole.log("message.dealerId is  ", message.dealerId);
         })
         .catch(function(error)
         {
            console.log("Why the heck");
            console.log("ERROR:",error);
            return gameInfo;
         });
         return gameInfo;
        //console.log(message.dealerId);
   };

   function getUserCount(roomInfo)
   {
      console.log('join room: ' + roomInfo.gameId.toString());
      socket.join(roomInfo.gameId.toString());
      const getPlayerCountQuery = "select count(gameplayer.game_id) from gameplayer where game_id = $1";
      roomInfo.count = 0;
     db.one(getPlayerCountQuery,[parseInt(roomInfo.gameId)]).
      then(function (data) {
          roomInfo.count = data.count;
          console.log("%j",roomInfo);
          io.sockets.in(roomInfo.gameId).emit(JOINED_ROOM,roomInfo);
      })
      .catch(function(error)
     {
        console.log("ERROR:",error);
     });
   }

})
}

module.exports = { init }
