/* eslint-disable react/forbid-prop-types */

import React, {useCallback, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {actions, href, isActive} from '../../src';
import {ReduxContext} from '../context';


const useNavigateTo = params => {
  const store = useContext(ReduxContext);
  return useCallback(event => {
    event.preventDefault();
    store.dispatch(actions.navigateTo(params));
  }, []);
};


const GlobalLinks = ({routingState}) => {
  const navigateToHome = useNavigateTo({pathname: '/'});
  const navigateToFoo = useNavigateTo({pathname: '/foo'});
  const navigateToBar = useNavigateTo({pathname: '/bar'});
  const navigateToCleanHistory = useNavigateTo({pathname: '/cleanHistory'});
  const navigateTo404 = useNavigateTo({pathname: '/404'});


  const navigateToBarXZ = useNavigateTo({pathname: '/bar/x/z'});
  const navigateToFooXZ = useNavigateTo({pathname: '/foo/x/z'});
  const navigateToFooXZMore = useNavigateTo({pathname: '/foo/x/z/more'});
  const navigateToFooSlash = useNavigateTo({pathname: '/foo/x/z/more'});


  return (
    <ul>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/'})}
          href={href(routingState, {pathname: '/'})}
          onClick={navigateToHome}>Home
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/foo'})}
          href={href(routingState, {pathname: '/foo'})}
          onClick={navigateToFoo}>/foo
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/bar'})}
          href={href(routingState, {pathname: '/bar'})}
          onClick={navigateToBar}>/bar
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/cleanHistory'})}
          href={href(routingState, {pathname: '/cleanHistory'})}
          onClick={navigateToCleanHistory}>/cleanHistory
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/404'})}
          href={href(routingState, {pathname: '/404'})}
          onClick={navigateTo404}>/404
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/bar/x/z'})}
          href={href(routingState, {pathname: '/bar/x/z'})}
          onClick={navigateToBarXZ}>/bar/x/z
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/foo/x/z'})}
          href={href(routingState, {pathname: '/foo/x/z'})}
          onClick={navigateToFooXZ}>/foo/x/z
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/foo/x/z/more'})}
          href={href(routingState, {pathname: '/foo/x/z/more'})}
          onClick={navigateToFooXZMore}>/foo/x/z/more
        </a>
      </li>
      <li>
        <a
          className="tab"
          data-active={isActive(routingState, {pathname: '/foo/'})}
          href={href(routingState, {pathname: '/foo/'})}
          onClick={navigateToFooSlash}>/foo/
        </a>
      </li>
    </ul>
  );
};
GlobalLinks.propTypes = {
  routingState: PropTypes.object.isRequired
};


const ComponentLinks = ({routingState}) => {
  const store = useContext(ReduxContext);


  const navigateTo = useCallback(params => event => {
    event.preventDefault();
    store.dispatch(actions.navigateTo(params));
  }, []);


  useEffect(() => {
    store.dispatch(actions.addDefaultParam('component', 'baz'));
    return () => {
      store.dispatch(actions.removeParam('component'));
    };
  }, []);


  return (
    <span>
      <a
        className="link"
        data-active={isActive(routingState, {query: {component: 'bla'}})}
        href={href(routingState, {query: {component: 'bla'}})}
        onClick={navigateTo({query: {component: 'bla'}})}>component: bla
      </a>
      <a
        className="link"
        data-active={isActive(routingState, {query: {component: 'baz'}})}
        href={href(routingState, {query: {component: 'baz'}})}
        onClick={navigateTo({query: {component: 'baz'}})}>component: baz
      </a>
    </span>
  );
};
ComponentLinks.propTypes = {
  routingState: PropTypes.object.isRequired
};

const SortedComponentLinks = ({routingState}) => {
  const store = useContext(ReduxContext);


  const navigateTo = useCallback(params => event => {
    event.preventDefault();
    store.dispatch(actions.navigateTo(params));
  }, []);


  useEffect(() => {
    store.dispatch(actions.addDefaultParam('offRecord', 'bla'));
    store.dispatch(actions.addOffRecordParam('offRecord'));
    return () => {
      store.dispatch(actions.removeParam('offRecord'));
    };
  }, []);


  return (
    <div>
      <h3>Changes are going to replace browser history</h3>
      <div>
        {['bla', 'baz', 'abc', 'zyx'].map(item => (
          <a
            className="link"
            data-active={isActive(routingState, {query: {offRecord: item}})}
            href={href(routingState, {query: {offRecord: item}})}
            key={item}
            onClick={navigateTo({query: {offRecord: item}})}>
            off-record: {item}
          </a>
        ))}
      </div>
    </div>
  );
};
SortedComponentLinks.propTypes = {
  routingState: PropTypes.object.isRequired
};


const Header = props => (
  <header className="header">
    <nav className="nav">
      <GlobalLinks {...props} />
    </nav>
  </header>
);


const Foo = props => (
  <div className="content">
    <h1>Foo</h1>
    <section>
      <ComponentLinks {...props} />
    </section>
  </div>
);


const Bar = () => (
  <div className="content">
    <h1>Bar</h1>
  </div>
);


const CleanHistory = props => (
  <div className="content">
    <h1>CleanHistory</h1>
    <section>
      <SortedComponentLinks {...props} />
    </section>
  </div>
);


const Home = () => (
  <div className="content">
    <h1>Home</h1>
  </div>
);


const NotFound = () => (
  <div className="content">
    <h1>Not Found</h1>
  </div>
);


// First matching route wins, so they should be ordered
// from the most specific to the least specific in case of overlap
const routes = {
  '/': Home,
  '/foo': Foo,
  '/foo/:*/:something/more': Foo,
  '/foo/:*/:something': Foo,
  '/foo/:*': Foo,
  '/bar/:*': Bar,
  '/cleanHistory': CleanHistory
};


export const App = () => {
  const store = useContext(ReduxContext);
  const [routingState, setRoutingState] = useState(store.getState().componentRouter);


  useEffect(() => {
    const unsubscribe = store.subscribe(
      () => setRoutingState(store.getState().componentRouter)
    );
    return () => {
      unsubscribe();
    };
  }, []);


  useEffect(() => {
    // Add routes
    Object.keys(routes).forEach(route => store.dispatch(actions.addRoute(route)));
  }, []);


  const CurrentComponent = routes[routingState.currentRoute.route] || NotFound;


  return (
    <div className="app">
      <h1>component-router</h1>
      <Header routingState={routingState} />
      <CurrentComponent routingState={routingState} />
      <section className="content">
        Routing state:
        <pre>{JSON.stringify(routingState, null, 2)}</pre>
      </section>
    </div>
  );
};
