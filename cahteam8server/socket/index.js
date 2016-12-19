const socketIo = require( 'socket.io' );
const {LOBBY_CHAT,JOINED_LOBBY,JOINED_ROOM,GAME_CHAT,USER_JOINED, MESSAGE_SEND,SUBMITTED_CARDS,JUDGED_CARDS,START_NEW_GAME} = require( '../src/constants/events' );
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

    socket.on(JOINED_ROOM, function(roomInfo){
    console.log('join room: ' + roomInfo.gameId.toString());
    socket.join(roomInfo.gameId.toString());
    io.sockets.in(roomInfo.gameId.toString()).emit(GAME_CHAT,roomInfo);
    //console.log(roomInfo.msg);
    });
    
   socket.on(GAME_CHAT, function(message){
   
    io.sockets.in(message.gameId).emit(GAME_CHAT,message);
      console.log('game message: ' + message.msg);
    });
})
}

module.exports = { init }
