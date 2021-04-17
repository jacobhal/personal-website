import React from 'react'
import { NavBar } from '../../components/NavBar'
import { Container, Row, Col } from 'react-bootstrap'
import CookingNavBar from './components/SideNavBar/CookingNavBar'

const Cooking = () => {
    return (
        <>
            <NavBar noImage={true} noMarginBottom={true} />
            <Container fluid className="cooking-page-container">
                <Row>
                    <Col sm={2}>
                        <CookingNavBar menuItem="none" />
                    </Col>
                    <Col
                        sm={10}
                        className="justify-content-center align-items-center text-center cooking-content"
                    >
                        <Container className="pb-3">
                            <h1 className="title">
                                Hej! Här hittar du recept och diverse tips om
                                matlagning.
                            </h1>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Cooking
