var socket = io();

$(document).ready(function () 
{
  $('#wait button').click(function (event) {

    $('#wait').hide();
    $('#gameview').show();

    return false;
  });
});
