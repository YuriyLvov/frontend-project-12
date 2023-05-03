import { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/auth';
import { selectCurrentChannelId } from '../../features/chats';
import { emitNewMessage } from '../../socket';

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

export default ChatMessageInput;
