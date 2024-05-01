const express = require('express');const http = require('http');
const socketIO = require('socket.io');const app = express();
const server = http.createServer(app);const io = socketIO(server);
app.use(express.static(__dirname + '/public'));
let players = {};io.on('connection', (socket) => {

    const PORT = process.env.PORT || 3000;
    socket.on('newElement', (data) => {
        io.emit('newElement', data);
    });


socket.on('player', (username) => {players[socket.id] = username;
console.log(username + " connected")});socket.on('message', (data) => {
io.emit('message', data);});socket.on('position', (position) => {
socket.broadcast.emit('position', position);});socket.on('removeElement', (id) => {
socket.broadcast.emit('removeElement', id);});socket.on('disconnect', () => {
const disconnectedPlayerName = players[socket.id];if (disconnectedPlayerName) {
io.emit('message', `${disconnectedPlayerName} disconnected`);
console.log(disconnectedPlayerName + " disconnected");delete players[socket.id];}});});
server.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});