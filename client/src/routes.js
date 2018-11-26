import React from 'react';
import { Home } from './views/Home';
import { About } from './views/About';
import { Contact } from './views/Contact';
import { Resume } from './views/Resume';

import { Route, Switch } from 'react-router-dom';

export const Routes = () => {
  return (
      <div>
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/`} exact component={Home}/>
          <Route path={`${process.env.PUBLIC_URL}/resume`} exact component={Resume}/>
          <Route path={`${process.env.PUBLIC_URL}/contact`} exact component={Contact}/>
          <Route path={`${process.env.PUBLIC_URL}/about`} exact component={About}/>
        </Switch>
      </div>
  );
};
