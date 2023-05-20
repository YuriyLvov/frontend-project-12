/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    initMessages: (state, action) => {
      state.push(...action.payload.messages);
    },
    addMessage: (state, action) => {
      state.push(action.payload);
    },
  },
});

export default messagesSlice.reducer;
