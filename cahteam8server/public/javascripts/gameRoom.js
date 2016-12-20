const GAME_CHAT = document.currentScript.getAttribute('GAME_CHAT');
const JOINED_ROOM = document.currentScript.getAttribute('JOINED_ROOM');
const JOINED_GAME = document.currentScript.getAttribute('JOINED_GAME');
const SUBMITTED_CARDS = document.currentScript.getAttribute('SUBMITTED_CARDS');
const JUDGED_CARDS = document.currentScript.getAttribute('JUDGED_CARDS');
const START_NEW_GAME = document.currentScript.getAttribute('START_NEW_GAME');
const NUM_PLAYERS = 4;

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

var usersSubmitted = 0;
var usersInRoom = 0;
var userCount = 0;
var pressedButton = false;

var selectedCardValue = "none";
var startedGame = false;
socket.emit(JOINED_ROOM,roomInfo);

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
       for(var i = 1; i<11; i++)
       {
          const handCard = '#hand' + String(i);
          $(handCard).text(message.hand[(i-1)]);
       }
    }
   const dealerId = message.dealerId;
   const blackCard = message.blackCard; 
   if(blackCard.length > 0)
       $('#phrase').text(blackCard);
   if(message.dealerId.toString() === playerNumber.toString())
   {
       $('#dealer').show();
       $('#player').hide();
   }
   else
   {
       $('#player').show();
       $('#dealer').hide();
   }

  });

  socket.on(GAME_CHAT,function(message)
  {
      addMessage(message.msg);
  });

  socket.on(SUBMITTED_CARDS,function(message)
  {
     usersSubmitted++;
     if(message.playerId == playerId)
     {
       for(var i = 1; i<11; i++)
       {  
          const handCard = '#hand' + String(i);
          $(handCard).text(message.hand[(i-1)]);
       }

     }
  });

$(document).ready(function ()
{
   function selectCard(event)
   {
     selectedCardValue = $(this).text();
     $('#submit1').text(selectedCardValue);
     return false;
  }

  $('#submitcard').click(function (event) {
      if(selectedCardValue == "")
         return false;
     const message = new Object();
     message.gameId = gameId;
     message.playerId = playerId;
     message.playerNumber = playerNumber;
     message.selectedCard = selectedCardValue;
     socket.emit(SUBMITTED_CARDS,message);
   });
 
  $('#wait button').click(function (event) {
    if(usersInRoom < NUM_PLAYERS || pressedButton == true)
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
