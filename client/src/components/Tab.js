import React from 'react';

const Tab = (props) => {
    return (
        <div>
            <li className={ `tab ${props.isactive}`}>
                <a>
                    <span className="icon is-small"><i className={`fa ${props.icon}`} aria-hidden="true"></i></span>
                    <span>{props.title}</span>
                </a>
            </li>
            {props.isactive ? props.children : null}
        </div>
    );
}

export default Tab;