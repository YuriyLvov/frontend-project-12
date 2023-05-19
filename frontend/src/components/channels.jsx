import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  ButtonGroup,
  Dropdown,
  Form,
  Nav,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { LocalesContext } from '../context/locales';
import { useWebSocket } from '../api';
import {
  addChannel,
  changeActiveChannel,
  removeChannel,
  renameChannel,
  selectChannels,
  selectCurrentChannelId,
} from '../slices';
import ChannelChangeModal from './channel-change-modal';
import ChannelRemoveModal from './channel-remove-modal';

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const chatScrollRef = useRef(null);
  const { t } = useContext(LocalesContext);
  const {
    emitNewChannel,
    emitRemoveChannel,
    emitRenameChannel,
    subscribeOnNewChannel,
    subscribeOnRemoveChannel,
    subscribeOnRenameChannel,
  } = useWebSocket();

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

  const onChannelAdded = () => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  const onAddChannel = (channelName) => {
    emitNewChannel(channelName).then(() => {
      handleCloseChangeModal();
      toast(t('channelCreated'), { type: 'success' });
    });
  };

  const onRenameChannel = (channelName) => {
    emitRenameChannel(channelIdToRename, channelName).then(() => {
      handleCloseChangeModal();
      toast(t('channelRenamed'), { type: 'success' });
    });
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

  useEffect(() => {
    subscribeOnNewChannel((payload) => {
      dispatch(addChannel(payload));
      setTimeout(() => {
        onChannelAdded();
      });
    });

    subscribeOnRemoveChannel((payload) => {
      dispatch(removeChannel(payload));
    });

    subscribeOnRenameChannel((payload) => {
      dispatch(renameChannel(payload));
    });
  }, []);

  return (
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{`${t('channels')}:`}</b>
        <Button onClick={() => handleShowChangeModal()} variant="outline-primary">+</Button>
      </div>
      <Nav className="px-2 mb-3 overflow-auto h-100 d-block" ref={chatScrollRef}>
        {
          Array.isArray(channels) && channels.map(({ name, id, removable }) => {
            const channelButton = (
              <Button
                className="text-start w-100 text-truncate"
                onClick={() => onChannelChange(id)}
                variant={currentChannelId === id ? 'secondary' : null}
              >
                {`# ${name}`}
              </Button>
            );

            return (
              <Nav.Item key={name} className="w-100">
                {removable ? (
                  <Dropdown as={ButtonGroup} className="w-100">
                    {channelButton}
                    <Dropdown.Toggle split variant={currentChannelId === id ? 'secondary' : null}>
                      <Form.Label visuallyHidden>{t('channelControl')}</Form.Label>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item className="text-start w-100" onClick={() => handleShowRemoveModal(id)}>{t('delete')}</Dropdown.Item>
                      <Dropdown.Item className="text-start w-100" onClick={() => handleShowChangeModal(id)}>{t('rename')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  channelButton
                )}
              </Nav.Item>
            );
          })
        }
      </Nav>
      {showChangeModal && (
        <ChannelChangeModal
          onAddChannel={onAddChannel}
          onRenameChannel={onRenameChannel}
          show={showChangeModal}
          handleClose={handleCloseChangeModal}
          initialChannelName={channelNameForRename}
          channelNames={channels.map(({ name }) => name)}
        />
      )}
      {showRemoveModal && (
        <ChannelRemoveModal
          show={showRemoveModal}
          handleClose={handleCloseRemoveModal}
          handleRemove={handleRemove}
        />
      )}
    </>
  );
};

export default Channels;
