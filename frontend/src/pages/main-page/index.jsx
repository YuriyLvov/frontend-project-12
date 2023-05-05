import { useContext, useEffect } from 'react';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getData } from '../../api';
import { SOCKET_EVENTS } from '../../constants';
import { AuthContext } from '../../context/auth';
import {
  addChannel,
  addMessage,
  init,
  removeChannel,
  renameChannel,
} from '../../features/chats';
import { socket } from '../../socket';
import Channels from '../../components/channels';
import Chat from '../../components/chat';

const MainPage = () => {
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      return;
    }

    getData({ token })
      .then((response) => {
        dispatch(init(response.data));

        socket.on(SOCKET_EVENTS.NEW_MESSAGE, (payload) => {
          dispatch(addMessage(payload));
        });

        socket.on(SOCKET_EVENTS.NEW_CHANNEL, (payload) => {
          dispatch(addChannel(payload));
        });

        socket.on(SOCKET_EVENTS.REMOVE_CHANNEL, (payload) => {
          dispatch(removeChannel(payload));
        });

        socket.on(SOCKET_EVENTS.RENAME_CHANNEL, (payload) => {
          dispatch(renameChannel(payload));
        });
      }).catch((error) => {
        console.error(error);
        toast(t('networkError'), { type: 'error' });
      });
  }, [dispatch, token, t]);

  return (
    <Container className="h-100 shadow rounded overflow-hidden">
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
