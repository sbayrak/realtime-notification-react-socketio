const { Server } = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on('connection', (socket) => {
  console.log('connected...');

  socket.on('newUser', (username) => {
    addNewUser(username, socket.id);
  });

  socket.on('sendNotification', ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit('getNotification', {
      senderName,
      type,
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected...');
    removeUser(socket.id);
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log('Server is listening')
);
