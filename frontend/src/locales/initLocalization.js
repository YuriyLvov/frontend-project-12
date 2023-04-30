import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import ru from './ru';

const initLocalization = () => {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en,
        ru,
      },
      lng: 'ru',
      fallbackLng: 'en',

      interpolation: {
        escapeValue: false,
      },
    });
};

export default initLocalization;
