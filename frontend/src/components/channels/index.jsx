import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Dropdown,
  Form,
  Nav,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { emitRemoveChannel } from '../../socket';
import {
  changeActiveChannel,
  createChannelAction,
  renameChannelAction,
  selectChannels,
  selectCurrentChannelId,
} from '../../features/chats';
import ChannelChangeModal from '../channel-change-modal';
import ChannelRemoveModal from '../channel-remove-modal';

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const { t } = useTranslation();

  const [error, setError] = useState('');
  const [channelNameForRename, setChannelNameForRename] = useState('');
  const [channelIdToRename, setChannelIdToRename] = useState(null);
  const [channelIdToRemove, setChannelIdToRemove] = useState(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const checkChannelName = (channelName) => {
    if (!channelName) {
      setError(t('requiredField'));
      return false;
    }

    const channelExists = Boolean(
      channels.find((channel) => channel.name === channelName),
    );

    if (channelExists) {
      setError(t('shouldBeUnique'));
      return false;
    }

    setError('');
    return true;
  };

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
    const channelNameIsValid = checkChannelName(channelName);

    if (!channelNameIsValid) {
      return;
    }

    dispatch(createChannelAction(channelName));
    handleCloseChangeModal();
    toast(t('channelCreated'), { type: 'success' });
  };

  const onRenameChannel = (channelName) => {
    const channelNameIsValid = checkChannelName(channelName);

    if (!channelNameIsValid) {
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
    <>
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{`${t('channels')}:`}</b>
        <Button onClick={() => handleShowChangeModal()} variant="outline-primary">+</Button>
      </div>
      <Nav className="px-2 mb-3 overflow-auto h-100 d-block">
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
          error={error}
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
    </>
  );
};

export default Channels;
