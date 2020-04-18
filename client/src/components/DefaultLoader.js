import React from 'react';

import { Loader, Heading } from 'react-bulma-components/full';

const DefaultLoader = ({props, children}) => {
    return (
        <div>
            <Heading className="has-text-centered subtitle-style" subtitle>
            {children}
            </Heading>
            <Loader
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