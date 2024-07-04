const socketIo = require('socket.io');

let ioInstance;

const configureSocketIO = (server) => {
  ioInstance = socketIo(server);

  ioInstance.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return ioInstance;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io has not been initialized.');
  }
  return ioInstance;
};

module.exports = {
  configureSocketIO,
  getIO,
};
