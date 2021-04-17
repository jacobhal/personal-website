import React from 'react'
import { Home } from './views/Home'
import { About } from './views/About'
import { Resume } from './views/Resume'
import { Contact } from './views/Contact'
import { Portfolio } from './views/Portfolio'
import { StockPredictor } from './views/StockPredictor'
import { ReactPlayground } from './views/ReactPlayground'
import { CoronaDashboard } from './views/CoronaDashboard'
import { Cooking } from './views/Cooking'
import { Starters } from './views/Cooking'
import { NotFound } from './views/404'
import { Route, Switch, Redirect } from 'react-router-dom'

export const Routes = () => {
    return (
        <>
            <Switch>
                <Route
                    path={`${process.env.PUBLIC_URL}/`}
                    exact
                    component={Home}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/resume`}
                    exact
                    component={Resume}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/contact`}
                    exact
                    component={Contact}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/about`}
                    exact
                    component={About}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/portfolio`}
                    exact
                    component={Portfolio}
                />

                {/* Portfolio routes */}
                <Route
                    path={`${process.env.PUBLIC_URL}/stockpredictor`}
                    exact
                    component={StockPredictor}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/react-playground`}
                    exact
                    component={ReactPlayground}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/corona-dashboard`}
                    exact
                    component={CoronaDashboard}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/cooking`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/starters`}
                    exact
                    component={Starters}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/main-courses`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/desserts`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/sauces`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/marinades`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/base-recipes`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/drinks`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/tools`}
                    exact
                    component={Cooking}
                />
                <Route
                    path={`${process.env.PUBLIC_URL}/cooking-tips`}
                    exact
                    component={Cooking}
                />

                {/* 404 fallback */}
                <Route path="/404" component={NotFound} />
                <Redirect to="/404" />
            </Switch>
        </>
    )
}
