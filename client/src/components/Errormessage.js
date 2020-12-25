import React from 'react'

import { Alert } from 'react-bootstrap'

const Errormessage = ({ children, title, topMargin }) => {
    return (
        <Alert variant="danger">
            <Alert.Heading>{title}</Alert.Heading>
            <p>{children}</p>
        </Alert>
    )
}

export default Errormessage
