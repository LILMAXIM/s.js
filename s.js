const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let connectedClients = 0;

io.on('connection', (socket) => {
    connectedClients++;
    console.log(`User connected: ${socket.id} (Total: ${connectedClients})`);
    
    io.emit('client-count', connectedClients);

    socket.on('smart-signal', (data) => {
        console.log(`Signal received from ${data.senderId}: ${data.message}`);
        io.emit('smart-signal', data);
    });

    socket.on('disconnect', () => {
        connectedClients--;
        console.log(`User disconnected: ${socket.id} (Total: ${connectedClients})`);
        io.emit('client-count', connectedClients);
    });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloud relay server running on port ${PORT}`);
});
