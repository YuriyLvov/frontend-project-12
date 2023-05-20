import axios from 'axios';
import { useMemo } from 'react';
import { io } from 'socket.io-client';

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

export const useWebSocket = () => {
  const socket = useMemo(() => io(), []);

  const emitNewMessage = (data, onDone, onError) => {
    const { message, username, channelId } = data;
    socket.timeout(SOCKET_TIMEOUT).emit(
      SOCKET_EVENTS.NEW_MESSAGE,
      { body: message, channelId, username },
      (err) => {
        console.error(err);
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

  const subscribeOnReconnectError = (callback) => {
    socket.io.on('reconnect_error', (error) => {
      console.error(error);
      socket.removeAllListeners();
      callback();
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
    subscribeOnReconnectError,
  };
};
