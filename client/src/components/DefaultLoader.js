import React from 'react';

import { Spinner } from 'react-bootstrap';

const DefaultLoader = ({props, children}) => {
    return (
        <div>
           
            <Spinner
            className="loading-spinner"
            style={{
                width: 200,
                height: 200,
                border: '8px solid grey',
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
            }} />
        </div>
    );
}

export default DefaultLoader;