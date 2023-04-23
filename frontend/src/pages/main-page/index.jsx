import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import {
  Container,
  Col,
  Form,
  Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ROUTER_PATHS } from '../../constants';
import { AuthContext } from '../../context/auth';
import {
  addMessage,
  init,
  selectChannels,
  selectCurrentChannelName,
  selectMessages,
  selectMessagesCount,
} from '../../features/chats';

const socket = io();

const Channels = () => {
  const channels = useSelector(selectChannels);

  return (
    <div>
      <h3>Каналы:</h3>
      {
        Array.isArray(channels) && (
          <ul>
            {channels.map(({ name }) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )
      }
    </div>
  );
};

const ChatHeader = () => {
  const currentChannelName = useSelector(selectCurrentChannelName);
  const messagesCount = useSelector(selectMessagesCount);

  return (
    <div>
      <b>{`# ${currentChannelName}`}</b>
      <p>{`${messagesCount} сообщений`}</p>
    </div>
  );
};

const ChatMessages = () => {
  const messages = useSelector(selectMessages);

  return (
    <Col className="chat-messages overflow-auto px-5 ">
      {messages.map((message) => (
        <div key={message.id}>
          <b>{message.username}</b>
          <span>: </span>
          <span>{message.body}</span>
        </div>
      ))}
    </Col>
  );
};

const ChatMessageInput = () => {
  const { username } = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('');

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    setDisabled(true);
    socket.timeout(5000).emit('newMessage', { body: message, channelId: 1, username }, (err) => {
      if (!err) {
        setMessage('');
      }
      setDisabled(false);
      console.error(err);
    });
  };

  return (
    <Form className="mt-auto px-5 py-3" onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="message">
        <Form.Control
          autoComplete="off"
          disabled={disabled}
          type="text"
          onChange={onChange}
          placeholder="Введите сообщение"
          value={message}
        />
      </Form.Group>
    </Form>
  );
};

const Chat = () => (
  <Col className="d-flex flex-column h-100">
    <ChatHeader />
    <ChatMessages />
    <ChatMessageInput />
  </Col>
);

const MainPage = () => {
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    axios.get('/api/v1/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response.data); // => { channels: [...], currentChannelId: 1, messages: [] }
        dispatch(init(response.data));

        socket.on('newMessage', (payload) => {
          dispatch(addMessage(payload));
        });
      });
  }, []);

  return (
    <Container className="container h-100 my-4 overflow-hidden rounded shadow">
      <Link to={ROUTER_PATHS.LOGIN}>LOGIN</Link>
      <Row bg="white" className="h-100 flex-md-row">
        <Col lg={2}>
          <Channels />
        </Col>
        <Col className="p-0 h-100">
          <Chat />
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
