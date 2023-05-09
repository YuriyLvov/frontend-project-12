import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container, Row } from 'react-bootstrap';
import {
  selectCurrentChannelName,
  selectMessagesCount,
} from '../../features/chats';

const ChatHeader = () => {
  const currentChannelName = useSelector(selectCurrentChannelName);
  const messagesCount = useSelector(selectMessagesCount);
  const { t } = useTranslation();

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
