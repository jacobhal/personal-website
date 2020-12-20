import React from 'react'

import { Jumbotron, Container } from 'react-bootstrap'
import { NavBar } from './NavBar'

const MainJumbotron = ({
    title,
    subtitle,
    backgroundClass,
    isFullHeight,
    children,
}) => {
    return (
        <Jumbotron
            fluid
            color="black"
            className={
                backgroundClass +
                ' ' +
                (isFullHeight ? 'jumbotron-full-page' : 'jumbotron-normal')
            }
        >
            <NavBar />
            <Container className="has-text-centered jumbotron-content">
                <h1
                    className="has-text-centered outline"
                    size={6}
                    id="jumbotron-subtitle"
                >
                    {subtitle}
                </h1>
                <h3 className="has-text-centered outline" id="jumbotron-title">
                    {title}
                </h3>
                {children}
            </Container>
        </Jumbotron>
    )
}

export default MainJumbotron
