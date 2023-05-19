import { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { SOCKET_EVENTS } from '../constants';
import { addMessage } from '../features/chats';
import { socket } from '../socket';
import ChatHeader from './chat-header';
import ChatMessages from './chat-messages';
import ChatMessageInput from './chat-message-input';

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (payload) => {
      dispatch(addMessage(payload));
    });
  }, []);

  return (
    <Col className="d-flex flex-column h-100">
      <ChatHeader />
      <ChatMessages />
      <ChatMessageInput />
    </Col>
  );
};

export default Chat;
