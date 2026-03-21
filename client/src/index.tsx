import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './styles/index.scss'
import { Routes } from './routes'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
    <Router>
        <React.StrictMode>
            <Routes />
        </React.StrictMode>
    </Router>
)

reportWebVitals()
