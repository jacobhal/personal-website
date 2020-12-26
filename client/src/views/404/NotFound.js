import React from 'react'

import { Container, Row, Col } from 'react-bootstrap'

const NotFound = () => {
    return (
        <Container fluid className="notfound-container">
            <Row className="justify-content-center">
                <Col md={12} className="text-center">
                    <h1 className="notfound-title">Oops!</h1>
                    <h5 className="notfound-subtitle">
                        We can't seem to find the page you are looking for.
                    </h5>
                    <p className="notfound-content">Error code: 404</p>
                    <a href="/" class="btn btn-primary btn-lg">
                        Home Page
                    </a>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound
