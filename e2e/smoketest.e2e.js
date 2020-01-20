import test from 'tape';
import React, {createElement as e} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';

import {combineReducers, createStore as createReduxStore} from 'redux';
import {componentRouter, locationHash} from '../src';
import {App} from '../example/App';
import {ReduxContext} from '../example/context';


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


test('location', t => {
  const store = createStore();
  // locationHash({store, namespace: 'componentRouter'});

  before();

  act(() => {
    render((
      e(ReduxContext.Provider, {value: store},
        e(App))
    ), app);
  });


  t.ok(app.querySelector('h1'));
  t.equal(app.querySelector('h1').innerHTML, 'component-router');

  t.ok(app.querySelector('a.tab[href^="/foo"]'));
  t.ok(app.querySelector('a.tab[href^="/bar"]'));

  act(() => {
    app.querySelector('a.tab[href^="/foo"]')
      .dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });


  after();
  t.end();
});
