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
