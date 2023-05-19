import { io } from 'socket.io-client';
import { SOCKET_EVENTS, SOCKET_TIMEOUT } from './constants';

export const socket = io();

export const emitNewMessage = (data, onDone, onError) => {
  const { message, username, channelId } = data;
  socket.timeout(SOCKET_TIMEOUT).emit(
    SOCKET_EVENTS.NEW_MESSAGE,
    { body: message, channelId, username },
    (err) => {
      if (err) {
        onError(err);
      } else {
        onDone();
      }
    },
  );
};

export const emitNewChannel = (channelName) => new Promise((done, fail) => {
  socket.timeout(SOCKET_TIMEOUT).emit(SOCKET_EVENTS.NEW_CHANNEL, { name: channelName }, (err) => {
    if (err) {
      fail(err);
    } else {
      done(true);
    }
  });
});

export const emitRemoveChannel = (id) => new Promise((done, fail) => {
  socket.timeout(SOCKET_TIMEOUT).emit(SOCKET_EVENTS.REMOVE_CHANNEL, { id }, (err) => {
    if (err) {
      fail(err);
    } else {
      done(true);
    }
  });
});

export const emitRenameChannel = (id, channelName) => new Promise((done, fail) => {
  socket.timeout(SOCKET_TIMEOUT)
    .emit(SOCKET_EVENTS.RENAME_CHANNEL, { id, name: channelName }, (err) => {
      if (err) {
        fail(err);
      } else {
        done(true);
      }
    });
});
