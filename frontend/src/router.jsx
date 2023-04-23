import React from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import Layout from './components/layout';
import LoginPage from './pages/login-page';
import MainPage from './pages/main-page';
import NotFoundPage from './pages/not-found-page';
import { ROUTER_PATHS } from './constants';

const router = createBrowserRouter([{
  element: <Layout />,
  children: [
    {
      path: ROUTER_PATHS.MAIN_PAGE,
      element: <MainPage />,
      loader: () => {
        const { token } = localStorage;

        if (!token) {
          throw redirect(ROUTER_PATHS.LOGIN);
        }

        return { token };
      },
    },
    {
      path: ROUTER_PATHS.LOGIN,
      element: <LoginPage />,
    },
    {
      path: ROUTER_PATHS.NOT_FOUND,
      element: <NotFoundPage />,
    },
  ],

}]);

export default router;
