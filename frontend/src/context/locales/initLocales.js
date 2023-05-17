import i18next from 'i18next';
import en from './en';
import ru from './ru';

const initLocales = () => new Promise((done, fail) => {
  const i18instance = i18next.createInstance();

  i18instance.init({
    resources: {
      en,
      ru,
    },
    lng: 'ru',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  }, (err) => {
    if (err) {
      fail(err);
      console.log('something went wrong loading', err);
      return;
    }
    done(i18instance);
  });
});

export default initLocales;
