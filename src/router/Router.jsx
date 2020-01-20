import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { routes } from './conf';


function Routes(props) {
  return props.routeConf.map((conf, i) => {
    return (
      <Route key={i} exact path={conf.path} component={conf.component} />
    );
  })
}

const Router = () => {
  return (
    <React.Fragment>
      <Route exact path="/">
        <Redirect to="/account/new" />
      </Route>
      <Routes routeConf={routes} />
    </React.Fragment>
  )
}

export default Router;