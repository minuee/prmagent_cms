import 'es6-shim';

import React from 'react';
import ReactDOM from 'react-dom';
import 'react-datepicker/dist/react-datepicker.css';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ko } from 'date-fns/esm/locale';
import { registerLocale, setDefaultLocale } from 'react-datepicker';

//--------------------------------------------------
// redux
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './redux/redux';

registerLocale('ko', ko);
setDefaultLocale('ko');
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
