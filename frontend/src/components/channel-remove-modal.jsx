import { useContext } from 'react';
import {
  Button,
  Modal,
} from 'react-bootstrap';
import { LocalesContext } from '../context/locales';

const ChannelRemoveModal = ({
  show,
  handleClose,
  handleRemove,
}) => {
  const { t } = useContext(LocalesContext);

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
      <Modal.Footer className="justify-content-between">
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

export default ChannelRemoveModal;
