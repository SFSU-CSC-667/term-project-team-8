const GAME_CHAT = document.currentScript.getAttribute('GAME_CHAT');
const JOINED_ROOM = document.currentScript.getAttribute('JOINED_ROOM');
var socket = io();

function addMessage(msg)
{
   $('#chat').append($('<li>').text(msg));
}

const username = document.currentScript.getAttribute('username');
const gameId = document.currentScript.getAttribute('gameId');
const roomInfo = new Object();
roomInfo.gameId= gameId;
roomInfo.msg=username + " has joined game " + gameId;


socket.emit(JOINED_ROOM,roomInfo);

$('#chatForm').submit(function(){
        const message = new Object();
        message.gameId= gameId;
        message.msg = username + ": " + $('#m').val();
        socket.emit(GAME_CHAT,message);
        $('#m').val('');
        return false;
  });

  socket.on(GAME_CHAT,function(message)
  {
          addMessage(message.msg);
  });

$(document).ready(function ()
{
  $('#wait button').click(function (event) {

    $('#wait').hide();
    $('#gameview').show();

    return false;
  });
});
