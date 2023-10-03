import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { setupStore } from './store/store';
import App from './components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
export const store = setupStore();
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <GoogleOAuthProvider clientId="107840811352-p9utehcv8k4vg740euputu8je9rqeag4.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </BrowserRouter>
);
