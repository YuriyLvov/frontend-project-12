import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.token || null);

  const setTokenStorage = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, [setToken]);

  const value = useMemo(() => ({ setToken: setTokenStorage, token }), [token, setTokenStorage]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
