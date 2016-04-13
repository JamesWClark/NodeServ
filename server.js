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
  console.log('user connected');
  
  socket.on('disconnect', function() {
    console.log('user disconnected');
    if(!socket.user) {
      return;
    }
    if(users.indexOf(socket.user) > -1) {
      users.splice(users.indexOf(socket.user), 1);
    }
    console.log('users: ' + users.length);
  });
  
  socket.on('user', function(user) {
    users.push(user);
    socket.user = user;
    console.log('users : ' + users.length);
  });
  
  socket.on('msg', function(msg) {
    io.sockets.emit('msg', {
      user: socket.user,
      data: msg
    });
  });
  
  socket.emit('welcome', { text : 'OH HAI! U R CONNECTED '});
});