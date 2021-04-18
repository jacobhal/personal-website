import React from 'react'
import { NavBar } from '../../components/NavBar'
import { Container, Row, Col } from 'react-bootstrap'
import CookingNavBar from './components/SideNavBar/CookingNavBar'
import MobileCookingGrid from './components/SideNavBar/MobileCookingGrid'

const CookingStartPage = () => {
    const content = <h1 className="title">Mina favoritrecept & bästa tips</h1>
    return (
        <>
            <NavBar noImage={true} noMarginBottom={true} />
            <Container fluid className="cooking-page-container h-100">
                <div className="cooking-page-mobile-container text-center">
                    {content}
                    <MobileCookingGrid className="h-100" />
                </div>
                <Row className="h-100 cooking-page-desktop-container">
                    <Col sm={2} className="pr-0">
                        <CookingNavBar menuItem="none" />
                    </Col>
                    <Col
                        sm={10}
                        className="justify-content-center align-items-center text-center cooking-content pl-0"
                    >
                        <Container className="pb-3">{content}</Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CookingStartPage
