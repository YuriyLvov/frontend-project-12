import { Formik } from 'formik';
import { useEffect, useRef } from 'react';
import {
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import getSchema from './validator';

const ChannelChangeModal = ({
  onAddChannel,
  onRenameChannel,
  show,
  handleClose,
  initialChannelName,
  channelNames,
}) => {
  const onSubmit = initialChannelName ? onRenameChannel : onAddChannel;
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const validator = getSchema(channelNames);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Formik
        initialValues={{
          channelName: initialChannelName || '', error: '',
        }}
        onSubmit={(value) => {
          onSubmit(value.channelName);
        }}
        validationSchema={validator}
      >
        {({
          errors,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form className="mt-auto px-5 py-3" onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{initialChannelName ? t('renameChannel') : t('addChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="channelName">
                <Form.Control
                  autoComplete="off"
                  ref={inputRef}
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.channelName}
                  isInvalid={errors.channelName}
                />
                <Form.Label visuallyHidden>{t('nameOfChannel')}</Form.Label>
                <Form.Control.Feedback type="invalid">
                  {errors.channelName}
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
        )}
      </Formik>

    </Modal>
  );
};

export default ChannelChangeModal;
