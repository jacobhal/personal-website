import React from 'react'
import { Home } from './views/Home'
import { About } from './views/About'
import { Resume } from './views/Resume'
import { Contact } from './views/Contact'
import { Portfolio } from './views/Portfolio'
import { StockPredictor } from './views/StockPredictor'
import { ReactPlayground } from './views/ReactPlayground'
import { CoronaDashboard } from './views/CoronaDashboard'
import { NotFound } from './views/404'
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom'

export const Routes: React.FC = () => {
    return (
        <RouterRoutes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/stockpredictor" element={<StockPredictor />} />
            <Route path="/react-playground" element={<ReactPlayground />} />
            <Route path="/corona-dashboard" element={<CoronaDashboard />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </RouterRoutes>
    )
}
