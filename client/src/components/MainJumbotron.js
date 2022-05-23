import React from 'react'

import { Jumbotron, Container, Row } from 'react-bootstrap'
import { NavBar } from './NavBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

const MainJumbotron = ({
    title,
    subtitle,
    backgroundClass,
    isFullHeight,
    children,
    scrollRef,
}) => {
    const executeScroll = (e) => {
        e.preventDefault()
        scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <Jumbotron
            className={
                backgroundClass +
                ' ' +
                (isFullHeight ? 'jumbotron-full-page' : 'jumbotron-normal')
            }
        >
            <NavBar />
            <Container className="jumbotron-content h-100">
                <Row className="justify-content-center align-items-center">
                    <h1
                        className="outline text-center"
                        size={6}
                        id="jumbotron-subtitle"
                    >
                        {subtitle}
                    </h1>
                </Row>
                <Row className="justify-content-center align-items-center">
                    <h3 className="outline text-center" id="jumbotron-title">
                        {title}
                    </h3>
                </Row>
                {children}
                {!isFullHeight && (
                    <Row
                        className="justify-content-center align-items-center"
                        id="scroll-arrow"
                    >
                        {scrollRef && (
                            <div class="arrow bounce">
                                <span onClick={executeScroll}>
                                    <FontAwesomeIcon icon={faArrowDown} />
                                </span>
                            </div>
                        )}
                    </Row>
                )}
            </Container>
        </Jumbotron>
    )
}

export default MainJumbotron
