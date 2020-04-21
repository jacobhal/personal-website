import React from 'react';

const Errormessage = ({children, title}) => {
    return (
        <article className="message is-large is-danger">
        <div className="message-header">
            <p>{title}</p>
        </div>
        <div className="message-body">
            {children}
        </div>
        </article>
    );
}

export default Errormessage;