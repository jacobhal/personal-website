import React from 'react'
import { Home } from './views/Home'
import { About } from './views/About'
import { Resume } from './views/Resume'
import { Contact } from './views/Contact'
import { Portfolio } from './views/Portfolio'
import { StockPredictor } from './views/StockPredictor'
import { ReactPlayground } from './views/ReactPlayground'
import { CoronaDashboard } from './views/CoronaDashboard'
import { CongressFilings } from './views/CongressFilings'
import { Skarp, SkarpDeleteAccount, SkarpPrivacy, SkarpTerms } from './views/Skarp'
import { Krydda, KryddaGuide, KryddaPrivacy, KryddaTerms, KryddaDeleteAccount } from './views/Krydda'
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
            <Route path="/congress" element={<CongressFilings />} />
            <Route path="/skarp" element={<Skarp />} />
            <Route path="/skarp/delete-account" element={<SkarpDeleteAccount />} />
            <Route path="/skarp/privacy" element={<SkarpPrivacy />} />
            <Route path="/skarp/terms" element={<SkarpTerms />} />
            <Route path="/krydda" element={<Krydda />} />
            <Route path="/krydda/guide" element={<KryddaGuide />} />
            <Route path="/krydda/privacy" element={<KryddaPrivacy />} />
            <Route path="/krydda/terms" element={<KryddaTerms />} />
            <Route path="/krydda/delete-account" element={<KryddaDeleteAccount />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </RouterRoutes>
    )
}
