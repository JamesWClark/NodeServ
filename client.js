//followup: http://stackoverflow.com/questions/11484418/socket-io-broadcast-to-certain-users

var user;
var socket;

function gogoSockets() {
  socket = io.connect('http://127.0.0.1:3000');
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
    user.image = null;
    user.name = null;
    user.email = null;
    user.id = null;
    toggleCredential();
  });
}

function toggleCredential() {
  if(user == null) {
    $('#activate').hide();
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
});
