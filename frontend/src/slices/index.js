import { configureStore } from '@reduxjs/toolkit';
import chatsReducer, { counterSlice } from './chats-slice';

const store = configureStore({
  reducer: {
    chats: chatsReducer,
  },
});

export default store;

export const {
  addMessage,
  init,
  addChannel,
  changeActiveChannel,
  removeChannel,
  renameChannel,
} = counterSlice.actions;

export {
  selectChannels,
  selectCurrentChannelId,
  selectCurrentChannelName,
  selectMessages,
  selectMessagesCount,
} from './selectors';
