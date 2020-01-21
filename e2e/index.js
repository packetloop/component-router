import test from 'tape';

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';


import {combineReducers, createStore as createReduxStore} from 'redux';
import {componentRouter, locationHistory} from '../src';
import {App} from '../example/App';
import {ReduxContext} from '../example/context';

import '../example/reset.css';
import '../example/app.css';

const createStore = initialState => {
  const rootReducer = combineReducers({
    componentRouter
  });
  return createReduxStore(rootReducer, initialState);
};

let app = null;
const before = () => {
  // setup a DOM element as a render target
  app = document.createElement('div');
  document.body.appendChild(app);
};

const after = () => {
  // cleanup on exiting
  unmountComponentAtNode(app);
  app.remove();
  app = null;
};


test.createStream({objectMode: true})
  .on('data', detail => document.body.dispatchEvent(new CustomEvent('tapeLog', {detail})));

test.onFinish(() => document.body.dispatchEvent(new CustomEvent('tapeFinish')));


test('all things', t => {
  const store = createStore();
  locationHistory({store, namespace: 'componentRouter'});

  before();

  act(() => {
    render((
      <ReduxContext.Provider value={store}>
        <App />
      </ReduxContext.Provider>
    ), app);
  });


  t.ok(app.querySelector('h1'));
  t.equal(app.querySelector('h1').innerHTML, 'component-router');

  t.ok(app.querySelector('a.tab[href^="/foo"]'));
  t.ok(app.querySelector('a.tab[href^="/bar1"]'));

  act(() => {
    app.querySelector('a.tab[href^="/foo"]')
      .dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
  });


  after();
  t.end();
});
