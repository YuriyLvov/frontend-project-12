import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import {
  Provider as RollbarProvider,
  ErrorBoundary,
} from '@rollbar/react';
import store from './slices';
import { AuthContextProvider } from './context/auth';
import { LocalesContextProvider } from './context/locales';
import reportWebVitals from './reportWebVitals';
import Router from './router';
import rollbarConfig from './rollbar.json';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RollbarProvider config={{ ...rollbarConfig, accessToken: process.env.REACT_APP_ROLLBAR_TOKEN }}>
    <ErrorBoundary>
      <Provider store={store}>
        <LocalesContextProvider>
          <AuthContextProvider>
            <Router />
            <ToastContainer />
          </AuthContextProvider>
        </LocalesContextProvider>
      </Provider>
    </ErrorBoundary>
  </RollbarProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
