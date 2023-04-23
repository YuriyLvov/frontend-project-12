import axios from 'axios';
import { useContext, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTER_PATHS } from '../../constants';
import { AuthContext } from '../../context/auth';
import {
  init,
  selectChannels,
  selectCurrentChannelName,
  selectMessages,
  selectMessagesCount,
} from '../../features/chats';

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
      {messages.map((message) => <div key={`id-${message}`}>{message}</div>)}
    </Col>
  );
};

const ChatMessageInput = () => (
  <Form className="mt-auto px-5 py-3">
    <Form.Group className="mb-3" controlId="message">
      <Form.Control type="text" placeholder="Введите сообщение" />
    </Form.Group>
  </Form>
);

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
