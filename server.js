const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;
let connectedPlayers = 0;
let players = {};

io.on('connection', (socket) => {
    // Increment connected players count and emit to all clients
    connectedPlayers++;
    io.emit('playersCount', connectedPlayers);

    // Emit newElement event to all clients
    socket.on('newElement', (data) => {
        io.emit('newElement', data);
    });

    socket.on('line', (data) => {
        // Broadcast the line data to all other connected clients
        socket.broadcast.emit('line', data);
    });

    // Handling player-related events
    socket.on('player', (username) => {
        players[socket.id] = username;
        console.log(username + " connected");
    });

    // Handling messaging events
    socket.on('message', (data) => {
        io.emit('message', data);
    });

    // Handling player position events
    socket.on('position', (position) => {
        socket.broadcast.emit('position', position);
    });

    // Handling element removal events
    socket.on('removeElement', (id) => {
        socket.broadcast.emit('removeElement', id);
    });

    // Handling disconnections
    socket.on('disconnect', () => {
        const disconnectedPlayerName = players[socket.id];
        if (disconnectedPlayerName) {
            // Emit message and update player count
            io.emit('message', `${disconnectedPlayerName} disconnected`);
            connectedPlayers--;
            io.emit('playersCount', connectedPlayers);
            console.log(disconnectedPlayerName + " disconnected");

            // Remove player from players object
            delete players[socket.id];
        }
    });
});

// Error handling
server.on('error', (err) => {
    console.error('Server error:', err);
});

// Start listening
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
