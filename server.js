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

var io = require('socket.io').listen(server);

// handles socket connections
io.sockets.on('connection', function(socket) {
    currentConnections++;
    totalConnections++;
    
    console.log(currentConnections + ': user connected');
    
    /* OUTBOUND */
    
    socket.emit('message', { text: 'You have connected'});
    socket.emit('users', { current: currentConnections, total: totalConnections });
    
    socket.broadcast.emit('users', { current: currentConnections, total: totalConnections });
    
    /* INBOUND */
    socket.on('pinj', function() {
        console.log('received PING. sending PONG');
        socket.emit('ponj', { text: 'PONG'});
    });
    
    /* this will receive a message from one user, log it on the server, and
     * broadcast it to the rest of the currently connected users
     */ 
    socket.on('message', function(data) {
        console.log('message received: ' + data.text);
        socket.broadcast.emit('message_response', data);
    });
    
    socket.on('disconnect', function() {
        currentConnections--;
        console.log(currentConnections + ': user disconnected');
        socket.broadcast.emit('users', { current: currentConnections, total: totalConnections });
    });
});
