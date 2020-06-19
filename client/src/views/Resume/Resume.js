import React from 'react';
import pdf from '../../assets/CV_swedish.pdf';
import pdf_english from '../../assets/CV_english.pdf';
//import { Document, Page } from 'react-pdf';

import MainHero from '../.././components/MainHero';

import { Columns } from 'react-bulma-components/full';

class Resume extends React.Component {

  render () {
    return (
      <div>
        <Helmet>
          <title>Jacob Hallman - Resume</title>
          <meta name="description" content="Check out my resume in either english or swedish." />
        </Helmet>
        <MainHero title="FIND OUT MORE" subtitle="Discover what I have done in my past"
        button={
        <Columns>
          <Columns.Column>
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
          </Columns.Column>
        </Columns>}
        fullheight="is-fullheight" background="has-bg-img-escalator"/>

      </div>
    );
  };
}

export default Resume;
