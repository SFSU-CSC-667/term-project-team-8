const GAME_CHAT = document.currentScript.getAttribute('GAME_CHAT');
const JOINED_ROOM = document.currentScript.getAttribute('JOINED_ROOM');
const JOINED_GAME = document.currentScript.getAttribute('JOINED_GAME');
const SUBMITTED_CARDS = document.currentScript.getAttribute('SUBMITTED_CARDS');
const JUDGED_CARDS = document.currentScript.getAttribute('JUDGED_CARDS');
const START_NEW_GAME = document.currentScript.getAttribute('START_NEW_GAME');

const playerId = document.currentScript.getAttribute('playerId');
const playerNumber = document.currentScript.getAttribute('playerNumber');
const username = document.currentScript.getAttribute('username');
const gameId = document.currentScript.getAttribute('gameId');
var socket = io();

function addMessage(msg)
{
   $('#chat').append($('<li>').text(msg));
}
const roomInfo = new Object();
roomInfo.gameId= gameId;
roomInfo.msg=username + " has joined game " + gameId;

var timesReached = 0;
var userCount = 0;
var pressedButton = false;
var selectedCardValue = "none";
var startedGame = false;

socket.emit(JOINED_ROOM,roomInfo);

var usersInRoom = 0;

$('#chatForm').submit(function(){
        const message = new Object();
        message.gameId= gameId;
        message.msg = username + ": " + $('#m').val();
        socket.emit(GAME_CHAT,message);
        $('#m').val('');
        return false;
  });

  socket.on(JOINED_ROOM,function(message)
  {
    addMessage(message.msg);
    usersInRoom = message.count;
  });
  
  socket.on(JOINED_GAME,function(anything)
  {
     if(pressedButton && startedGame == false)
     {
      const message = new Object();
      message.gameId= gameId;
      message.playerNumber = playerNumber;
      message.playerId = playerId;
      startedGame = true;
      socket.emit(START_NEW_GAME,message);
     }
  });

  socket.on(START_NEW_GAME,function(message)
  {
    if(message.playerId === playerId)
    {
       $('#wait').hide();
       $('#gameview').show();
       $('#player').show();
       $('#dealer').hide();
       for(var i = 1; i<11; i++)
       {
          const handCard = '#hand' + String(i);
          $(handCard).text(message.hand[(i-1)]);
       }
    }
    const blackCard = message.blackCard;
    if(blackCard !=undefined && blackCard != "")
       $('#phrase').txt(blackCard);
  });

  socket.on(GAME_CHAT,function(message)
  {
      addMessage(message.msg);
  });

$(document).ready(function ()
{
   function selectCard(event)
   {
     $(this).text("good");
   }
 
  $('#wait button').click(function (event) {
    if(usersInRoom < 2 || pressedButton == true)
        return false;
    const message = new Object();
    message.gameId = gameId.toString();
    message.msg = (userCount+1).toString();
    pressedButton = true;
    socket.emit(JOINED_GAME,message);    
    return false;
  });
  for(var i = 1; i<11; i++)
  {
    const handCard = '#hand' + String(i);
    $(handCard).click(selectCard);
  }
});
