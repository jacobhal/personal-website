import React from 'react';
import pdf from '../../assets/CV.pdf';
//import { Document, Page } from 'react-pdf';

import MainHero from '../.././components/MainHero';

class Resume extends React.Component {

  render () {
    return (
      <div>
        <MainHero title="FIND OUT MORE" subtitle="Discover what I have done in my past"
        button={
        <div>
          <a download="CV.pdf" href={pdf} id="btn-resume" className="is-hidden-mobile button is-link">
            DOWNLOAD SWEDISH RESUME
          </a>
          <a download="CV.pdf" href={pdf} id="btn-resume-mobile" className="is-hidden-tablet button is-link">
            DOWNLOAD RESUME
          </a>
        </div>}
        fullheight="is-fullheight" background="has-bg-img-escalator"/>

      </div>
    );
  };
}

export default Resume;
