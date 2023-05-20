import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from 'react-router-dom';
import Layout from './components/layout';
import { ROUTER_PATHS } from './constants';
import { useAuth } from './context/auth';
import LoginPage from './pages/login-page';
import MainPage from './pages/main-page';
import NotFoundPage from './pages/not-found-page';
import SignUpPage from './pages/signup-page';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to={ROUTER_PATHS.LOGIN} />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route
        element={<ProtectedRoute><MainPage /></ProtectedRoute>}
        path={ROUTER_PATHS.MAIN_PAGE}
      />
      <Route element={<LoginPage />} path={ROUTER_PATHS.LOGIN} />
      <Route element={<SignUpPage />} path={ROUTER_PATHS.SIGN_UP} />
      <Route element={<NotFoundPage />} path={ROUTER_PATHS.NOT_FOUND} />
    </Route>
  </Routes>
);

const Router = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default Router;
