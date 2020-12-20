import React from 'react';
import pdf from '../../assets/CV_swedish.pdf';
import pdf_english from '../../assets/CV_english.pdf';
//import { Document, Page } from 'react-pdf';

import MainJumbotron from '../.././components/MainJumbotron';

import { Columns } from 'react-bootstrap';
import { Helmet } from "react-helmet";

class Resume extends React.Component {

  render () {
    return (
      <div>
        <Helmet>
          <title>Jacob Hallman - Resume</title>
          <meta name="description" content="Check out my resume in either english or swedish." />
        </Helmet>
        <MainJumbotron 
          title="FIND OUT MORE" 
          subtitle="Discover what I have done in my past"
          backgroundClass="has-bg-img-escalator"
          isFullHeight={true}>
            <Row>
              <div>
              <a download="CV_swedish.pdf" href={pdf} id="btn-resume" className="is-hidden-mobile button is-link">
                DOWNLOAD SWEDISH RESUME
              </a>
              </div>
              <div>
                <a download="CV_english.pdf" href={pdf_english} id="btn-resume-english" className="is-hidden-mobile button is-link">
                  DOWNLOAD ENGLISH RESUME
                </a>
              </div>
              <div>
                <a download="CV_swedish.pdf" href={pdf} id="btn-resume-mobile" className="is-hidden-tablet button is-link">
                  SWEDISH RESUME
                </a>
              </div>
              <div>
                <a download="CV_english.pdf" href={pdf_english} id="btn-resume-mobile-english" className="is-hidden-tablet button is-link">
                  ENGLISH RESUME
                </a>
              </div>
            </Row>
          </MainJumbotron>

      </div>
    );
  };
}

export default Resume;
