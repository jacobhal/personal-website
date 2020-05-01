import React from 'react';

const Errormessage = ({children, title, topMargin}) => {
    return (
        <article className="message is-large is-danger" style={{marginTop: topMargin}}>
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