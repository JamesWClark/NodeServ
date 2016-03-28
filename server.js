var http = require('http');
var fs = require('fs');
var currentConnections = 0; // num connected users
var totalConnections = 0;

// the server
var server = http.createServer(function (req,res) {
    fs.readFile('./index.html', function(error, data) {
        res.writeHead(200, { 'Content-Type' : 'text/html'});
        res.end(data, 'utf-8');
    });
}).listen(3000, "0.0.0.0");

console.log('Server on http://0.0.0.0:3000/');

// socket.io
var io = require('socket.io').listen(server);

// handle socket connections
io.sockets.on('connection', function(socket) {
    currentConnections++;
    totalConnections++;
    
    console.log(currentConnections + ': user connected');
    
    // send messages to the current connecting user
    socket.emit('message', { text: 'You have connected'});
    socket.emit('users', { current: currentConnections, total: totalConnections });
    
    socket.broadcast.emit('users', { current: currentConnections, total: totalConnections });
    
    socket.on('disconnect', function() {
        currentConnections--;
        console.log(currentConnections + ': user disconnected');
        socket.broadcast.emit('users', { current: currentConnections, total: totalConnections });
    });
});
