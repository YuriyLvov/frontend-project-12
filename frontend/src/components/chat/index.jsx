import { Col } from 'react-bootstrap';
import ChatHeader from '../chat-header';
import ChatMessages from '../chat-messages';
import ChatMessageInput from '../chat-message-input';

const Chat = () => (
  <Col className="d-flex flex-column h-100">
    <ChatHeader />
    <ChatMessages />
    <ChatMessageInput />
  </Col>
);

export default Chat;
