import React from 'react'

interface TabProps {
    isactive?: string
    icon?: string
    title?: string
    children?: React.ReactNode
}

const Tab: React.FC<TabProps> = (props) => {
    return (
        <div>
            <li className={`tab ${props.isactive}`}>
                <a href="#!">
                    <span className="icon is-small">
                        <i
                            className={`fa ${props.icon}`}
                            aria-hidden="true"
                        />
                    </span>
                    <span>{props.title}</span>
                </a>
            </li>
            {props.isactive ? props.children : null}
        </div>
    )
}

export default Tab