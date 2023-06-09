import { useContext, useEffect } from 'react';
import {
  Col,
  Row,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getData, useWebSocket } from '../api';
import { ROUTER_PATHS } from '../constants';
import { useAuth } from '../context/auth';
import { LocalesContext } from '../context/locales';
import { initChannels, initMessages } from '../slices';
import Channels from '../components/channels';
import Chat from '../components/chat';

const MainPage = () => {
  const dispatch = useDispatch();
  const { logOut, token } = useAuth();
  const { t } = useContext(LocalesContext);
  const navigate = useNavigate();
  const { subscribeOnReconnectError } = useWebSocket();
  const handleError = () => {
    navigate(ROUTER_PATHS.LOGIN);
    toast(t('networkError'), { type: 'error' });
    logOut();
  };

  useEffect(() => {
    subscribeOnReconnectError(handleError);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    getData({ token })
      .then((response) => {
        const { channels, currentChannelId, messages } = response.data;
        dispatch(initChannels({ channels, currentChannelId }));
        dispatch(initMessages({ messages }));
      }).catch((error) => {
        console.error(error);
        handleError();
      });
  }, [token]);

  return (
    <Row bg="white" className="h-100 flex-md-row border rounded">
      <Col className="px-0 bg-light flex-column h-100 d-flex" lg={2}>
        <Channels />
      </Col>
      <Col className="p-0 h-100">
        <Chat />
      </Col>
    </Row>
  );
};

export default MainPage;
