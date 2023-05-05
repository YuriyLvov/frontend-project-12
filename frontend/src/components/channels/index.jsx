import { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Dropdown,
  Row,
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

export default Channels;
