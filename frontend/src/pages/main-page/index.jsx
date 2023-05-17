import { useContext, useEffect } from 'react';
import {
  Col,
  Row,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../api';
import { ROUTER_PATHS } from '../../constants';
import { AuthContext } from '../../context/auth';
import { LocalesContext } from '../../context/locales';
import { init } from '../../features/chats';
import Channels from '../../components/channels';
import Chat from '../../components/chat';

const MainPage = () => {
  const dispatch = useDispatch();
  const { logOut, token } = useContext(AuthContext);
  const { t } = useContext(LocalesContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      return;
    }

    getData({ token })
      .then((response) => {
        dispatch(init(response.data));
      }).catch((error) => {
        console.error(error);
        toast(t('networkError'), { type: 'error' });
        logOut();
        navigate(ROUTER_PATHS.LOGIN);
      });
  }, [dispatch, token, t]);

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
