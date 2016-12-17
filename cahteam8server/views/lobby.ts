doctype html
html
  head
    title Lobby
    link(rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous")
    script(src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js")
    script(src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous")
    link(rel="stylesheet" href="stylesheets/stylesheet.css")

  body(class="backgroundset")
    div(class="col-xs-12 barstyle bgstyle borderstyle")
      ul(class="nav nav-pills col-xs-12 ")
        li(class="active")
          a(data-toggle="tab" href="#lobby") Home
        li
          a(data-toggle="tab" href="#leaderboard") Leaderboard
        li
          a(data-toggle="tab" href="#rules") Rules
        li
          a(data-toggle="tab" href="#about") About
        li(class="nav navbar-right")
          a(data-toggle="tab" class="logout" href="logout" name="logout" onclick="location.href='lobby/logOut'") Log Out

    div(class="container widthfull")

      div(class="row col-xs-12")
        div(class="tab-content paddingtop col-xs-9")
          div(class="tab-pane active" id="lobby")
            div(class="row")
              form(action="/lobby/createGame"  method="post" class="col-xs-3")
                div(class="form-group row")
                  label(class="col-xs-12 col-form-label formcenter formhead") Create New Room
                div(class="form-group row")
                  label(class="col-xs-7 col-form-label") Score (3-15)
                  div(class="col-xs-5")
                    input(type="number" class="form-control" name="score" min="3" max="15" value="3")
                div(class="")
                  div(class="col-xs-12")
                    button(class="buttonstyle whitetext widthfull" type="submit") Create New Room

              div(class="col-xs-9")
                label(class="col-xs-12 col-form-label formhead") Join Room
                each game in games
                  button(class="gameroom inlineblock" method="get" onclick="location.href='/lobby/joinGame?gameId=" + game + "'") 
                    b Game #{game}

          div(class="col-xs-5 tab-pane" id="leaderboard")
            table(class="table")
              thead
                tr
                  th Rank 
                  th Name 
                  th Score 
              tbody
                each player in leadershipBoard
                  tr
                     td #{player.rank}
                     td #{player.username}
                     td #{player.score}
          div(class="tab-pane" id="rules")
            h1 
              u Rules
          div(class="tab-pane" id="about")
            div(class="center")
              h1 
                u About us
              h3 San Francisco State University
              h3 Internet Application Design and Development CSC 667/867 Section 01 Fall2016

              h2(class="aboutteam")
                u Team 8
              div(class="aboutmembers")
                p Arjun Patel
                p Zi Liang Zhen
                p Elric Dang
                p Peter Chau

        div(class="col-xs-3") 
          b Chat
          div(class="chatwindow")
            ul(id="chat" class="well well-lg")
            form(class="form-inline")
              div(class="form-group")
                input(id="m" class="form-control chat" autocomplete="off")
              button(class="btn" type="submit") send

            // source: http://socket.io/get-started/chat/
            script(src="/socket.io/socket.io.js")
            script(src="http://code.jquery.com/jquery-1.11.1.js")
            script().
            var socket = io();
            $('form').submit(function(){
              socket.emit('chat message', $('#m').val());
              $('#m').val('');
              return false;
            });
            socket.on('chat message', function(msg){
              $('#chat').append($('<li>').text(msg));
            });
