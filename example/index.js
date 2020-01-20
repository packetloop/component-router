import React from 'react';
import ReactDOM from 'react-dom';
import {ReduxContext} from './context';
import {locationHash, locationHistory} from '../src';


import {App} from './App';
import {createStore} from './App/store';


import './reset.css';
import './app.css';

const appRoot = document.createElement('div');

appRoot.id = 'app';
document.body.appendChild(appRoot);


const store = createStore();


if (process.env.HISTORY === 'HASH') {
  // When publishing to GitHub Pages we cannon use HTML5 history navigation
  locationHash({store, Fnamespace: 'componentRouter'});
} else {
  locationHistory({store, namespace: 'componentRouter'});
}


ReactDOM.render((
  <ReduxContext.Provider value={store}>
    <App />
  </ReduxContext.Provider>
), appRoot);
