import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.token || null);
  const [username, setUserName] = useState(localStorage.username || null);

  const setTokenStorage = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }, [setToken]);

  const setUsernameStorage = useCallback((newUsername) => {
    localStorage.setItem('username', newUsername);
    setUserName(newUsername);
  }, [setUserName]);

  const logOut = useCallback(() => {
    setTokenStorage('');
    setUsernameStorage('');
  }, [setTokenStorage, setUsernameStorage]);

  const value = useMemo(() => ({
    logOut,
    setToken: setTokenStorage,
    setUsername: setUsernameStorage,
    token,
    username,
  }), [token, setTokenStorage, setUsernameStorage, logOut, username]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
