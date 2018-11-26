import React from 'react';
import pdf from '../../assets/CV.pdf';
//import { Document, Page } from 'react-pdf';

import MainHero from '../.././components/MainHero';

import { Button } from 'react-bulma-components/full';

class Resume extends React.Component {
  /*
  <Section>
    <Document
      file={pdf}
      onLoadSuccess={this.onDocumentLoadSuccess}
    >
      <Page className="pdf-page" pageNumber={1} />
      <Page className="pdf-page" pageNumber={2} />
    </Document>
  </Section>
  */

  render () {
    return (
      <div>
        <MainHero title="FIND OUT MORE" subtitle="Discover what I have done in my past"
        button={  <a download="CV.pdf" href={pdf}>
          <Button id="btn-resume" className="is-hidden-mobile">DOWNLOAD SWEDISH RESUME</Button>
          <Button id="btn-resume-mobile" className="is-hidden-tablet">DOWNLOAD RESUME</Button>
        </a>}
        fullheight="is-fullheight" background="has-bg-img-escalator"/>

      </div>
    );
  };
}

export default Resume;
