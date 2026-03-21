import React from 'react'

interface TabsProps {
    defaultActiveKey?: string
    variant?: string
    children?: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
    return (
        <div id="tabs-with-content">
            <div className="tabs is-boxed">
                <ul>{children}</ul>
            </div>
        </div>
    )
}

export default Tabs