var http = require('http');
var fs = require('fs');

var users = [];

var server = http.createServer(function(req,res) {
  fs.readFile('./index.html', function(error, data) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end(data, 'utf-8');
  });
}).listen(3000, '127.0.0.1');
console.log('server listening');

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
  
  socket.on('disconnect', function() {
    if(!socket.user) {
      return;
    }
    if(users.indexOf(socket.user) > -1) {
      console.log(socket.user.id + ' disconnected');
      users.splice(users.indexOf(socket.user), 1);
      socket.broadcast.emit('otherUserDisconnect', socket.user);
    }
    console.log('users: ' + users.length);
  });
  
  socket.on('user', function(user) {
    console.log(user.id + ' connected');
    users.push(user);
    socket.user = user;
    console.log('users : ' + users.length);
    socket.broadcast.emit('otherUserConnect', user);
  });
  
  socket.on('msg', function(msg) {
    io.sockets.emit('msg', {
      user: socket.user,
      data: msg
    });
  });
  
  socket.emit('welcome', { text : 'OH HAI! U R CONNECTED '});
});