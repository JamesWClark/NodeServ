//followup: http://stackoverflow.com/questions/11484418/socket-io-broadcast-to-certain-users

var user;
var socket;
var users = {};

function logPropertiesOfObject(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      console.log(key + " -> " + JSON.stringify(obj[key]));
    }
  }
}

function gogoSockets() {
  socket = io.connect('http://127.0.0.1:3000');
  
  socket.on('msg', function(msg) {
    $('#chat-log').append('<div><strong>' + msg.user.name + '</strong>: ' + msg.data + '</div>');
  });
  
  socket.on('otherUserConnect', function(data) {
    users[user.id] = data;
    console.log(data.id);
    console.log(data.image);
    $('#usersonline').append('<img data-id="' + data.id + '" src="' + data.image + '">');
  });
  
  socket.on('otherUserDisconnect', function(user) {
    delete users[user.id];
  });
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  user = {
    image : profile.getImageUrl(),
    name : profile.getName(),
    email : profile.getEmail(),
    id : profile.getId()
  };
  console.log('sending user obj: ' + user);
  socket.emit('user', user);
  toggleCredential();
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    user = null;
    toggleCredential();
  });
}

function toggleCredential() {
  if(user == null) {
    $('#activate').hide();
    $('#chat-log').html('');
    $('#signin').show();    
  } else {
    $('#username').text(user.name);
    $('#useremail').text(user.email);
    $('#userid').text(user.id);
    $('#userimage').html('<img src="' + user.image + '"/>');
    $('#activate').show();
    $('#signin').hide();
  }
}

$(document).ready(function() {
  gogoSockets();
  
  $('#btnSendMessage').click(function() {
    var msg = $('#chat-input').val();
    socket.emit('msg', msg);
    $('#chat-input').val('');
    $('#chat-input').focus();
  });
  
  $('#chat-input').keyup(function(event) {
    if(event.keyCode == 13) {
      $('#btnSendMessage').click();
    }
  });
  
});
