import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import filter from 'leo-profanity';
import { selectMessages } from '../../features/chats';

const ChatMessages = () => {
  const messages = useSelector(selectMessages);

  return (
    <Col className="chat-messages overflow-auto px-5 ">
      {messages.map((message) => (
        <div key={message.id}>
          <b>{message.username}</b>
          <span>: </span>
          <span>{filter.clean(message.body, '*', 2)}</span>
        </div>
      ))}
    </Col>
  );
};

export default ChatMessages;