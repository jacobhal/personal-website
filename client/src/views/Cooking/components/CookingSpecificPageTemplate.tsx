import React from 'react'
import { NavBar } from '../../../components/NavBar'
import { Container, Row, Col } from 'react-bootstrap'
import CookingNavBar from './../components/SideNavBar/CookingNavBar'

interface ICookingProps {
    children: React.ReactNode
}

const CookingSpecificPageTemplate: React.FunctionComponent<ICookingProps> = ({
    children,
}: ICookingProps) => {
    const content = <h1 className="title">Mina favoritrecept & bästa tips</h1>
    return (
        <>
            <NavBar noImage={true} noMarginBottom={true} />
            <Container fluid className="cooking-page-container h-100">
                <div className="cooking-page-mobile-container text-center">
                    "Back arrow"
                    {children}
                </div>
                <Row className="h-100 cooking-page-desktop-container">
                    <Col sm={2} className="pr-0">
                        <CookingNavBar menuItem="none" />
                    </Col>
                    <Col
                        sm={10}
                        className="justify-content-center align-items-center text-center cooking-content pl-0"
                    >
                        <Container className="pb-3">{children}</Container>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CookingSpecificPageTemplate
