import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Container,
  Col,
  Dropdown,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { SOCKET_EVENTS } from '../../constants';
import { emitNewMessage, emitRemoveChannel, socket } from '../../socket';
import { AuthContext } from '../../context/auth';
import {
  addChannel,
  addMessage,
  changeActiveChannel,
  createChannelAction,
  init,
  removeChannel,
  renameChannel,
  renameChannelAction,
  selectChannels,
  selectCurrentChannelId,
  selectCurrentChannelName,
  selectMessages,
  selectMessagesCount,
} from '../../features/chats';

const ChannelChangeModal = ({
  onAddChannel,
  onRenameChannel,
  show,
  handleClose,
  initialChannelName,
}) => {
  const [channelName, setChannelName] = useState(initialChannelName);
  const handleSubmit = initialChannelName ? onRenameChannel : onAddChannel;
  const { t } = useTranslation();

  const onChange = (event) => {
    setChannelName(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(channelName);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form className="mt-auto px-5 py-3" onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialChannelName ? t('renameChannel') : t('addChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="channelName">
            <Form.Control
              autoComplete="off"
              type="text"
              onChange={onChange}
              value={channelName}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {t('send')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

const ChannelRemoveModal = ({
  show,
  handleClose,
  handleRemove,
}) => {
  const { t } = useTranslation();

  const onClick = (event) => {
    event.preventDefault();
    handleRemove();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('deleteChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('areYouSure')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('cancel')}
        </Button>
        <Button onClick={onClick} variant="danger">
          {t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();

  const [channelNameForRename, setChannelNameForRename] = useState('');
  const [channelIdToRename, setChannelIdToRename] = useState(null);
  const [channelIdToRemove, setChannelIdToRemove] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const handleCloseChangeModal = () => {
    setShowChangeModal(false);
    setChannelNameForRename('');
  };

  const handleShowChangeModal = (id = null) => {
    const channelToRename = channels.find((channel) => channel.id === id);

    if (channelToRename) {
      setChannelNameForRename(channelToRename.name);
    }
    setChannelIdToRename(id);
    setShowChangeModal(true);
  };

  const onAddChannel = (channelName) => {
    if (!channelName) {
      return;
    }

    dispatch(createChannelAction(channelName));
    handleCloseChangeModal();
    toast(t('channelCreated'), { type: 'success' });
  };

  const onRenameChannel = (channelName) => {
    const channelExists = Boolean(
      channels.find((channel) => channel.name === channelName),
    );

    if (!channelName || channelExists) {
      return;
    }

    dispatch(renameChannelAction({ id: channelIdToRename, name: channelName }));
    handleCloseChangeModal();
    toast(t('channelRenamed'), { type: 'success' });
  };

  const onChannelChange = (id) => {
    dispatch(changeActiveChannel(id));
  };

  const handleCloseRemoveModal = () => {
    setShowRemoveModal(false);
    setChannelIdToRemove(null);
  };

  const handleShowRemoveModal = (id) => {
    setChannelIdToRemove(id);
    setShowRemoveModal(true);
  };

  const handleRemove = () => {
    emitRemoveChannel(channelIdToRemove);
    setShowRemoveModal(false);
    toast(t('channelDeleted'), { type: 'success' });
  };

  return (
    <div>
      <Row>
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>{`${t('channels')}:`}</b>
          <Button onClick={() => handleShowChangeModal()} variant="outline-primary">+</Button>
        </div>
      </Row>
      {
        Array.isArray(channels) && channels.map(({ name, id, removable }) => {
          const channelButton = (
            <Button
              className="text-start w-100"
              onClick={() => onChannelChange(id)}
              variant={currentChannelId === id ? 'secondary' : null}
            >
              {`# ${name}`}
            </Button>
          );

          return (
            <Row key={name}>
              {removable ? (
                <Dropdown as={ButtonGroup}>
                  {channelButton}
                  <Dropdown.Toggle split variant={currentChannelId === id ? 'secondary' : null} />

                  <Dropdown.Menu>
                    <Dropdown.Item className="text-start w-100" onClick={() => handleShowRemoveModal(id)}>{t('delete')}</Dropdown.Item>
                    <Dropdown.Item className="text-start w-100" onClick={() => handleShowChangeModal(id)}>{t('rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                channelButton
              )}
            </Row>
          );
        })
      }
      {showChangeModal && (
        <ChannelChangeModal
          onAddChannel={onAddChannel}
          onRenameChannel={onRenameChannel}
          show={showChangeModal}
          handleClose={handleCloseChangeModal}
          initialChannelName={channelNameForRename}
        />
      )}
      {showRemoveModal && (
        <ChannelRemoveModal
          show={showRemoveModal}
          handleClose={handleCloseRemoveModal}
          handleRemove={handleRemove}
        />
      )}
    </div>
  );
};

const ChatHeader = () => {
  const currentChannelName = useSelector(selectCurrentChannelName);
  const messagesCount = useSelector(selectMessagesCount);
  const { t } = useTranslation();

  return (
    <div>
      <b>{`# ${currentChannelName}`}</b>
      <p>{`${messagesCount} ${t('messagesCount')}`}</p>
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
          <span>{filter.clean(message.body, '*', 2)}</span>
        </div>
      ))}
    </Col>
  );
};

const ChatMessageInput = () => {
  const { username } = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const channelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const onDone = () => {
    setMessage('');
    setDisabled(false);
  };

  const onError = (error) => {
    setDisabled(false);
    console.error(error);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    setDisabled(true);

    emitNewMessage(message, username, channelId, onDone, onError);
  };

  return (
    <Form className="mt-auto px-5 py-3" onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="message">
        <Form.Control
          autoComplete="off"
          disabled={disabled}
          type="text"
          onChange={onChange}
          placeholder={t('enterMessage')}
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
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      return;
    }

    axios.get('/api/v1/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
  }, [dispatch, token]);

  return (
    <Container className="container h-100 my-4 overflow-hidden rounded shadow">
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
