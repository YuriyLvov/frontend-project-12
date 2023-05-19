import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Col } from 'react-bootstrap';
import filter from 'leo-profanity';
import cn from 'classnames';
import { selectMessages } from '../features/chats';
import { AuthContext } from '../context/auth';

const ChatMessages = () => {
  const { username } = useContext(AuthContext);
  const messages = useSelector(selectMessages);

  return (
    <Col className="chat-messages overflow-auto px-5 d-flex flex-column justify-content-end">
      {messages.map((message) => {
        const isUserMessage = message.username === username;

        return (
          <div
            className={cn('d-flex', {
              'justify-content-end': isUserMessage,
            })}
            key={message.id}
          >
            <Alert
              className="w-75"
              variant={isUserMessage ? 'primary' : 'warning'}
            >
              <b>{message.username}</b>
              <span>: </span>
              <span>{filter.clean(message.body)}</span>
            </Alert>
          </div>
        );
      })}
    </Col>
  );
};

export default ChatMessages;
