import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import './styles/index.scss'
import { Routes } from './routes'
import reportWebVitals from './reportWebVitals'
import {
    initAcquisitionTelemetry,
    tagAcquisitionErrorScope,
} from './services/acquisitionTelemetry'

initAcquisitionTelemetry()

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
    <Sentry.ErrorBoundary
        beforeCapture={tagAcquisitionErrorScope}
        fallback={
            <main role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Something went wrong</h1>
                <p>Please reload the page and try again.</p>
            </main>
        }
    >
        <Router>
            <React.StrictMode>
                <Routes />
            </React.StrictMode>
        </Router>
    </Sentry.ErrorBoundary>
)

reportWebVitals()
