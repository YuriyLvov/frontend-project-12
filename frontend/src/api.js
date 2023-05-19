import axios from 'axios';
import { io } from 'socket.io-client';
// import { useMemo } from 'react';

const API_PATH = '/api/v1';

export const login = ({ username, password }) => axios.post(`${API_PATH}/login`, { username, password });

export const signup = ({ username, password }) => axios.post(`${API_PATH}/signup`, { username, password });

export const getData = ({ token }) => axios.get(`${API_PATH}/data`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const SOCKET_EVENTS = {
  NEW_CHANNEL: 'newChannel',
  NEW_MESSAGE: 'newMessage',
  REMOVE_CHANNEL: 'removeChannel',
  RENAME_CHANNEL: 'renameChannel',
};

const SOCKET_TIMEOUT = 5000;

const socket = io();

export const useWebSocket = () => {
  const emitNewMessage = (data, onDone, onError) => {
    console.log('data', data);
    console.log('onDone', onDone);
    console.log('onError', onError);
    const { message, username, channelId } = data;
    socket.timeout(SOCKET_TIMEOUT).emit(
      SOCKET_EVENTS.NEW_MESSAGE,
      { body: message, channelId, username },
      (err) => {
        console.log('err', err);
        if (err) {
          onError(err);
        } else {
          onDone();
        }
      },
    );
  };

  const emitNewChannel = (channelName) => new Promise((done, fail) => {
    socket.timeout(SOCKET_TIMEOUT).emit(SOCKET_EVENTS.NEW_CHANNEL, { name: channelName }, (err) => {
      if (err) {
        fail(err);
      } else {
        done(true);
      }
    });
  });

  const emitRemoveChannel = (id) => new Promise((done, fail) => {
    socket.timeout(SOCKET_TIMEOUT).emit(SOCKET_EVENTS.REMOVE_CHANNEL, { id }, (err) => {
      if (err) {
        fail(err);
      } else {
        done(true);
      }
    });
  });

  const emitRenameChannel = (id, channelName) => new Promise((done, fail) => {
    socket.timeout(SOCKET_TIMEOUT)
      .emit(SOCKET_EVENTS.RENAME_CHANNEL, { id, name: channelName }, (err) => {
        if (err) {
          fail(err);
        } else {
          done(true);
        }
      });
  });

  const subscribeOnNewMessage = (callback) => {
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (payload) => {
      callback(payload);
    });
  };

  const subscribeOnNewChannel = (callback) => {
    socket.on(SOCKET_EVENTS.NEW_CHANNEL, (payload) => {
      callback(payload);
    });
  };

  const subscribeOnRemoveChannel = (callback) => {
    socket.on(SOCKET_EVENTS.REMOVE_CHANNEL, (payload) => {
      callback(payload);
    });
  };

  const subscribeOnRenameChannel = (callback) => {
    socket.on(SOCKET_EVENTS.RENAME_CHANNEL, (payload) => {
      callback(payload);
    });
  };

  return {
    emitNewMessage,
    emitNewChannel,
    emitRemoveChannel,
    emitRenameChannel,
    subscribeOnNewMessage,
    subscribeOnNewChannel,
    subscribeOnRemoveChannel,
    subscribeOnRenameChannel,
  };
};
