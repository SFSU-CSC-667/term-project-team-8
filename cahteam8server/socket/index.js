const socketIo = require( 'socket.io' );
const {LOBBY_CHAT} = require( '../src/constants/events' );
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
 
})
}

module.exports = { init }
