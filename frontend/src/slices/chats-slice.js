/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { GENERAL_CHANNEL_ID } from '../constants';

const initialState = {
  channels: [],
  currentChannelId: 0,
  messages: [],
};

export const counterSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    init: (state, action) => {
      state.channels = action.payload.channels;
      state.currentChannelId = action.payload.currentChannelId;
      state.messages = action.payload.messages;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
      state.currentChannelId = action.payload.id;
    },
    changeActiveChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(({ id }) => id !== action.payload.id);

      if (state.currentChannelId === action.payload.id) {
        state.currentChannelId = GENERAL_CHANNEL_ID;
      }
    },
    renameChannel: (state, action) => {
      const currentChannel = state.channels.find((channel) => channel.id === action.payload.id);
      currentChannel.name = action.payload.name;
    },
  },
});

export default counterSlice.reducer;
