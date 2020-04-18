import React from 'react';

const Tabs = ({defaultActiveKey, variant, children}) => {
    return (
        <div id="tabs-with-content" >
            <div className="tabs is-boxed">
                <ul>
                    {children}
                </ul>
            </div>
        </div>
    );
}

export default Tabs;