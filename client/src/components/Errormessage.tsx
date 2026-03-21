import React from 'react'
import { Alert, AlertTitle } from '@mui/material'

interface ErrormessageProps {
    children: React.ReactNode
    title: string
}

const Errormessage: React.FC<ErrormessageProps> = ({ children, title }) => {
    return (
        <Alert severity="error">
            <AlertTitle>{title}</AlertTitle>
            {children}
        </Alert>
    )
}

export default Errormessage
