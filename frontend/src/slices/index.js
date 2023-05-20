import { configureStore } from '@reduxjs/toolkit';
import channelsReducer, { channelsSlice } from './channels-slice';
import messagesReducer, { messagesSlice } from './messages-slice';

const store = configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
  },
});

export default store;

export const {
  initChannels,
  addChannel,
  changeActiveChannel,
  removeChannel,
  renameChannel,
} = channelsSlice.actions;

export const {
  addMessage,
  initMessages,
} = messagesSlice.actions;

export {
  selectChannels,
  selectCurrentChannelId,
  selectCurrentChannelName,
  selectMessages,
  selectMessagesCount,
} from './selectors';
