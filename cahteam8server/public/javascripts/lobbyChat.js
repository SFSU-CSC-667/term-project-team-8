const LOBBY_CHAT = document.currentScript.getAttribute('LOBBY_CHAT');
function addMessage(msg)
{
   $('#chat').append($('<li>').text(msg));
}

  var socket = io();
  const username = document.currentScript.getAttribute('username') + " : ";
  $('form').submit(function(){
        socket.emit(LOBBY_CHAT,username+ $('#m').val());
        $('#m').val('');
        return false;
  });
  socket.on(LOBBY_CHAT,function(msg)
  {
          addMessage(msg);
  });
/*var chat = $('chat');
if(chat != null)
{
socket.on('chat message', function(msg){
        console.log(msg);
        //$('#chat').append($('<li>').text(msg));
      });
}
else
{
socket.on('chat message', function(msg){
        console.log("hello");
        //$('#chat').append($('<li>').text("hello"));
      });
}*/
/*$(document).ready(function() {
  var socket = io();
  $('button).click(function () {
   socket.emit('chat message',$('#m').val());
   $('#m').val('');
   return false;
  });
  socket.on('chat message',function(msg) {
    $('#chat').append($('<li>').text(msg));
  });
}*/
