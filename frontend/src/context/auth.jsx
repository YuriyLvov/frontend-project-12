import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const AuthContext = createContext();

const useProvideAuth = () => {
  const [token, setTokenLocalState] = useState(localStorage.getItem('token') || null);
  const [username, setUserNameLocalState] = useState(localStorage.getItem('username') || null);

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

  const auth = useMemo(() => ({
    ...authData,
    ...authActions,
  }), [authData, authActions]);

  return auth;
};

export const AuthContextProvider = ({ children }) => {
  const auth = useProvideAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
