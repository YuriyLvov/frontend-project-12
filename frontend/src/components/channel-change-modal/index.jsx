import { useState } from 'react';
import {
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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

export default ChannelChangeModal;
