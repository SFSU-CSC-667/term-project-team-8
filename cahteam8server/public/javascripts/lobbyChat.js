const LOBBY_CHAT = document.currentScript.getAttribute('LOBBY_CHAT');
var socket = io();

function addMessage(msg)
{
   $('#chat').append($('<li>').text(msg));
}

const username = document.currentScript.getAttribute('username');
socket.emit(LOBBY_CHAT,username + " has joined the chat");
  $('#chatForm').submit(function(){
        socket.emit(LOBBY_CHAT,username+" : "+ $('#m').val());
        $('#m').val('');
        return false;
  });
  socket.on(LOBBY_CHAT,function(msg)
  {
          addMessage(msg);
  });
