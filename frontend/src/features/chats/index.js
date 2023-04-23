/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

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
      const messageExists = Boolean(
        state.messages.find((message) => message.id === action.payload.id),
      );

      if (!messageExists) {
        state.messages.push(action.payload);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { addMessage, init } = counterSlice.actions;

export const selectChannels = (state) => state.chats.channels;
export const selectCurrentChannelId = (state) => state.chats.currentChannelId;
export const selectCurrentChannelName = (state) => {
  const channels = selectChannels(state);
  const currentChannelId = selectCurrentChannelId(state);

  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelName = currentChannel?.name || '';

  return currentChannelName;
};

export const selectMessages = (state) => state.chats.messages;
export const selectMessagesCount = (state) => {
  const messages = selectMessages(state);

  return messages?.length || 0;
};

export default counterSlice.reducer;
