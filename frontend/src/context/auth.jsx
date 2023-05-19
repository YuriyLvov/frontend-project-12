import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [token, setTokenLocalState] = useState(localStorage.token || null);
  const [username, setUserNameLocalState] = useState(localStorage.username || null);

  const setToken = useCallback((newToken) => {
    localStorage.setItem('token', newToken);
    setTokenLocalState(newToken);
  }, [setTokenLocalState]);

  const setUsername = useCallback((newUsername) => {
    localStorage.setItem('username', newUsername);
    setUserNameLocalState(newUsername);
  }, [setUserNameLocalState]);

  const logOut = useCallback(() => {
    setToken('');
    setUsername('');
  }, [setToken, setUsername]);

  const authData = useMemo(() => ({
    token,
    username,
  }), [token, username]);

  const authActions = useMemo(() => ({
    logOut,
    setToken,
    setUsername,
  }), [setToken, setUsername, logOut]);

  const authContextValues = useMemo(() => ({
    ...authData,
    ...authActions,
  }), [authData, authActions]);

  return (
    <AuthContext.Provider value={authContextValues}>
      {children}
    </AuthContext.Provider>
  );
};
