import {
  createContext,
  useEffect,
  useState,
} from 'react';
import initLocales from './initLocales';

export const LocalesContext = createContext();

export const LocalesContextProvider = ({ children }) => {
  const [i18instance, setI18instance] = useState(null);

  useEffect(() => {
    initLocales().then((instance) => setI18instance(instance));
  }, []);

  return (
    <LocalesContext.Provider value={i18instance}>
      {i18instance ? children : null}
    </LocalesContext.Provider>
  );
};
