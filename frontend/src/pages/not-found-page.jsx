import { useContext } from 'react';
import { LocalesContext } from '../context/locales';

const NotFoundPage = () => {
  const { t } = useContext(LocalesContext);

  return <div>{t('notFound')}</div>;
};

export default NotFoundPage;
