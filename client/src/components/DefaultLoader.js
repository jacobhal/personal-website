import React from 'react'

import { Spinner } from 'react-bootstrap'

const DefaultLoader = () => {
    return (
        <div className="text-center justify-content-center align-items-center">
            <h3 className="pb-3">Loading...</h3>
            <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
                style={{
                    width: 200,
                    height: 200,
                    border: '8px solid grey',
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                }}
            />
        </div>
    )
}

export default DefaultLoader
