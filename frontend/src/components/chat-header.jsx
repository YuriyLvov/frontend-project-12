import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row } from 'react-bootstrap';
import { LocalesContext } from '../context/locales';
import {
  selectCurrentChannelName,
  selectMessagesCount,
} from '../features/chats';

const ChatHeader = () => {
  const currentChannelName = useSelector(selectCurrentChannelName);
  const messagesCount = useSelector(selectMessagesCount);
  const { t } = useContext(LocalesContext);

  return (
    <Container>
      <Row>
        <b>{`# ${currentChannelName}`}</b>
        <p>{`${messagesCount} ${t('messagesCount')}`}</p>
      </Row>
    </Container>
  );
};

export default ChatHeader;
