import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { storage } from '../storage';

export const AuthContext = createContext();

const useProvideAuth = () => {
  const [token, setTokenLocalState] = useState(storage.get('token') || null);
  const [username, setUserNameLocalState] = useState(storage.get('username') || null);

  const setToken = useCallback((newToken) => {
    storage.set('token', newToken);
    setTokenLocalState(newToken);
  }, [setTokenLocalState]);

  const setUsername = useCallback((newUsername) => {
    storage.set('username', newUsername);
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
}

export const AuthContextProvider = ({ children }) => {
  const auth = useProvideAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};