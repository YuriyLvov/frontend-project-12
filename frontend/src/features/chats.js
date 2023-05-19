/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { GENERAL_CHANNEL_ID } from '../constants';

export const selectChannels = (state) => state.chats.channels;
export const selectCurrentChannelId = (state) => state.chats.currentChannelId;
export const selectCurrentChannelName = (state) => {
  const channels = selectChannels(state);
  const currentChannelId = selectCurrentChannelId(state);

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelName = currentChannel?.name || '';

  return currentChannelName;
};

export const selectMessages = (state) => {
  const currentChannelId = selectCurrentChannelId(state);

  return state.chats.messages.filter((message) => message.channelId === currentChannelId);
};
export const selectMessagesCount = (state) => {
  const messages = selectMessages(state);

  return messages?.length || 0;
};

const initialState = {
  addedChannelName: '',
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
      const messageExists = Boolean(
        state.messages.find((message) => message.id === action.payload.id),
      );

      if (!messageExists) {
        state.messages.push(action.payload);
      }
    },
    addChannel: (state, action) => {
      const channelExists = Boolean(
        state.channels.find((channel) => channel.id === action.payload.id),
      );

      if (!channelExists) {
        state.channels.push(action.payload);

        if (state.addedChannelName === action.payload.name) {
          state.currentChannelId = action.payload.id;
        }
      }
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
      state.channels = state.channels.map((channel) => {
        if (channel.id === action.payload.id) {
          return { ...channel, name: action.payload.name };
        }

        return channel;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addMessage,
  init,
  addChannel,
  changeActiveChannel,
  removeChannel,
  renameChannel,
} = counterSlice.actions;

export default counterSlice.reducer;
