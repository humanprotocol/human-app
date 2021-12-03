import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/index';
import { getJwtPayload } from './utils/jwt';
import { getMyAccount } from './service/user.service';
import { signIn, signOut, setUserDetails } from './store/action';

async function init() {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const initialState = {
    auth: {
      token,
      refreshToken,
    },
  };
  const store = configureStore(initialState);

  if (token) {
    try {
      const userId = getJwtPayload(token);
      const user = await getMyAccount(userId, token);
      store.dispatch(setUserDetails(user));
      store.dispatch(signIn());
    } catch (err) {
      store.dispatch(signOut());
    }
  } else {
    store.dispatch(signOut());
  }

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  );
}

init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
