import React from 'react'
import pdf from '../../assets/CV_swedish.pdf'
import pdf_english from '../../assets/CV_english.pdf'
//import { Document, Page } from 'react-pdf';

import MainJumbotron from '../.././components/MainJumbotron'

import { Row, Col, Container } from 'react-bootstrap'
import { Helmet } from 'react-helmet'

class Resume extends React.Component {
    render() {
        return (
            <div>
                <Helmet>
                    <title>Jacob Hallman - Resume</title>
                    <meta
                        name="description"
                        content="Check out my resume in either english or swedish."
                    />
                </Helmet>
                <MainJumbotron
                    title="FIND OUT MORE"
                    subtitle="Discover what I have done in my past"
                    backgroundClass="has-bg-img-escalator"
                    isFullHeight={true}
                >
                    <Row className="cv-swedish-btn-row justify-content-center align-items-center">
                        <a
                            download="CV_swedish.pdf"
                            href={pdf}
                            id="btn-resume-swedish"
                            className="d-none d-md-block btn btn-light main-button"
                        >
                            DOWNLOAD SWEDISH RESUME
                        </a>
                    </Row>
                    <Row className="cv-english-btn-row justify-content-center align-items-center">
                        <a
                            download="CV_english.pdf"
                            href={pdf_english}
                            id="btn-resume-english"
                            className="d-none d-md-block btn btn-light main-button"
                        >
                            DOWNLOAD ENGLISH RESUME
                        </a>
                    </Row>
                    <Row className="cv-swedish-btn-row justify-content-center align-items-center">
                        <a
                            download="CV_swedish.pdf"
                            href={pdf}
                            id="btn-resume-mobile-swedish"
                            className="d-md-none btn btn-light main-button"
                        >
                            SWEDISH RESUME
                        </a>
                    </Row>
                    <Row className="cv-english-btn-row justify-content-center align-items-center">
                        <a
                            download="CV_english.pdf"
                            href={pdf_english}
                            id="btn-resume-mobile-english"
                            className="d-md-none btn btn-light main-button"
                        >
                            ENGLISH RESUME
                        </a>
                    </Row>
                </MainJumbotron>
            </div>
        )
    }
}

export default Resume
