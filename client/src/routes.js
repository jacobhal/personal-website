import React from 'react';
import { Home } from './views/Home';
import { About } from './views/About';
import { Resume } from './views/Resume';
import { Contact } from './views/Contact';
import { Portfolio } from './views/Portfolio';
import { StockPredictor } from './views/StockPredictor';
import { ReactPlayground } from './views/ReactPlayground';
import { CoronaDashboard } from './views/CoronaDashboard';
import { Route, Switch } from 'react-router-dom';



export const Routes = () => {
  return (
      <div>
        <Switch>
          <Route path={`${process.env.PUBLIC_URL}/`} exact component={Home}/>
          <Route path={`${process.env.PUBLIC_URL}/resume`} exact component={Resume}/>
          <Route path={`${process.env.PUBLIC_URL}/contact`} exact component={Contact}/>
          <Route path={`${process.env.PUBLIC_URL}/about`} exact component={About}/>
          <Route path={`${process.env.PUBLIC_URL}/portfolio`} exact component={Portfolio}/>

          {/* Portfolio routes */}
          <Route path={`${process.env.PUBLIC_URL}/stockpredictor`} exact component={StockPredictor}/>
          <Route path={`${process.env.PUBLIC_URL}/react-playground`} exact component={ReactPlayground}/>
          <Route path={`${process.env.PUBLIC_URL}/corona-dashboard`} exact component={CoronaDashboard}/>
        </Switch>
      </div>
  );
};
