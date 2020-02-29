import React from 'react';
import { Home } from './views/Home';
import { About } from './views/About';
import { Resume } from './views/Resume';
import { Contact } from './views/Contact';
import { Projects } from './views/Projects';

import { Route, Switch } from 'react-router-dom';
import { StockPredictor } from './views/StockPredictor';

export const Routes = () => {
  return (
      <div>
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/`} exact component={Home}/>
          <Route path={`${process.env.PUBLIC_URL}/resume`} exact component={Resume}/>
          <Route path={`${process.env.PUBLIC_URL}/contact`} exact component={Contact}/>
          <Route path={`${process.env.PUBLIC_URL}/about`} exact component={About}/>
          <Route path={`${process.env.PUBLIC_URL}/projects`} exact component={Projects}/>
          <Route path={`${process.env.PUBLIC_URL}/stockPredictor`} exact component={StockPredictor}/>
        </Switch>
      </div>
  );
};
