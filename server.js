// File: server.js (Node.js + Express + Socket.io)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for development purposes
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Sample route for health check
app.get('/', (req, res) => {
  res.send('Real-time Chat Server is Running!');
});

// List of connected users
let users = [];

// Handle socket connection
io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Handle user joining
    socket.on('join', (username) => {
      socket.username = username;
  
      // Notify only other users
      socket.broadcast.emit('user-joined', username);
  
      console.log(`${username} joined the chat`);
    });
  
    // Handle sending messages
    socket.on('send-message', (data) => {
      socket.broadcast.emit('receive-message', data);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.username) {
        socket.broadcast.emit('user-left', socket.username);
        console.log(`${socket.username} left the chat`);
      }
    });
  });
  

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
