import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ChannelChangeModal = ({
  error,
  onAddChannel,
  onRenameChannel,
  show,
  handleClose,
  initialChannelName,
}) => {
  const [channelName, setChannelName] = useState(initialChannelName);
  const handleSubmit = initialChannelName ? onRenameChannel : onAddChannel;
  const inputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

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
              ref={inputRef}
              type="text"
              onChange={onChange}
              value={channelName}
            />
            <Form.Label visuallyHidden>{t('nameOfChannel')}</Form.Label>
          </Form.Group>

          <Form.Group controlId="error">
            <Form.Control
              autoComplete="off"
              className="d-none"
              type="text"
              isInvalid={error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
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
