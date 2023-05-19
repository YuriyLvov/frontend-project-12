import { useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addMessage } from '../features/chats';
import { useWebSocket } from '../api';
import ChatHeader from './chat-header';
import ChatMessages from './chat-messages';
import ChatMessageInput from './chat-message-input';

const Chat = () => {
  const dispatch = useDispatch();
  const { subscribeOnNewMessage } = useWebSocket();

  useEffect(() => {
    subscribeOnNewMessage((payload) => dispatch(addMessage(payload)));
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
