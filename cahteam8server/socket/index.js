const socketIo = require( 'socket.io' );

const init = ( app, server ) => {
  const io = socketIo(server);
  app.set('io',io);
  io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('disconnect', function(){
    console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
 
})
}

module.exports = { init }
