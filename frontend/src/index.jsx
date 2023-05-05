import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
  Provider as RollbarProvider,
  ErrorBoundary,
} from '@rollbar/react';
import { initLocalization } from './locales';
import store from './store';
import { AuthContextProvider } from './context/auth';
import './index.css';
import reportWebVitals from './reportWebVitals';
import router from './router';
import rollbarConfig from './rollbar.json';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

initLocalization();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RollbarProvider config={rollbarConfig}>
    <ErrorBoundary>
      <React.StrictMode>
        <Provider store={store}>
          <AuthContextProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </AuthContextProvider>
        </Provider>
      </React.StrictMode>
    </ErrorBoundary>
  </RollbarProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
