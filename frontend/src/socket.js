import { io } from 'socket.io-client';

export const socket = io();

export const emitNewMessage = (message, username, channelId, onDone, onError) => {
  socket.timeout(5000).emit('newMessage', { body: message, channelId, username }, (err) => {
    if (err) {
      onError(err);
    } else {
      onDone();
    }
  });
};

export const emitNewChannel = (channelName) => new Promise((done, fail) => {
  socket.timeout(5000).emit('newChannel', { name: channelName }, (err) => {
    if (err) {
      fail(err);
    } else {
      done(true);
    }
  });
});

export const emitRemoveChannel = (id) => new Promise((done, fail) => {
  socket.timeout(5000).emit('removeChannel', { id }, (err) => {
    if (err) {
      fail(err);
    } else {
      done(true);
    }
  });
});

export const emitRenameChannel = (id, channelName) => new Promise((done, fail) => {
  socket.timeout(5000).emit('renameChannel', { id, name: channelName }, (err) => {
    if (err) {
      fail(err);
    } else {
      done(true);
    }
  });
});
