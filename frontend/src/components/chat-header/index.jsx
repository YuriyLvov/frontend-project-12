import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  selectCurrentChannelName,
  selectMessagesCount,
} from '../../features/chats';

const ChatHeader = () => {
  const currentChannelName = useSelector(selectCurrentChannelName);
  const messagesCount = useSelector(selectMessagesCount);
  const { t } = useTranslation();

  return (
    <div>
      <b>{`# ${currentChannelName}`}</b>
      <p>{`${messagesCount} ${t('messagesCount')}`}</p>
    </div>
  );
};

export default ChatHeader;
