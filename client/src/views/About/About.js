import React from 'react';

import MainHero from '../.././components/MainHero';

import { Columns, Button } from 'react-bulma-components/full';

const About = props => {
    return (
      <div>
        <Helmet>
          <title>Jacob Hallman - About</title>
          <meta name="description" content="This page contains various links to social platforms such as LinkedInand Github as well as a link to my public master's thesis." />
        </Helmet>
        <MainHero title="DIG A LITTLE DEEPER" subtitle="Visit my social accounts to find out more about my projects"
        background="has-bg-img-ocean"
        button={
          <Columns>
            <Columns.Column id='wrapper-btn-github' className='wrapper-btn-github'>
              <a href="https://github.com/jacobhal" target="_blank" rel="noopener noreferrer"><Button id="btn-github">GITHUB</Button></a>
            </Columns.Column>
            <Columns.Column id='wrapper-btn-linkedin' className='wrapper-btn-linkedin'>
              <a href="https://www.linkedin.com/in/jacob-hallman-603829164/" target="_blank" rel="noopener noreferrer">
              <Button id="btn-linkedin">LINKEDIN</Button></a>
            </Columns.Column>
            <Columns.Column id='wrapper-btn-thesis' className='wrapper-btn-thesis'>
              <a href="http://kth.diva-portal.org/smash/record.jsf?dswid=-8603&pid=diva2%3A1383464&c=1&searchType=SIMPLE&language=sv&query=jacob+hallman&af=%5B%5D&aq=%5B%5B%5D%5D&aq2=%5B%5B%5D%5D&aqe=%5B%5D&noOfRows=50&sortOrder=author_sort_asc&sortOrder2=title_sort_asc&onlyFullText=false&sf=all" 
              target="_blank" rel="noopener noreferrer">
                <Button id="btn-thesis" className="is-hidden-tablet">THESIS</Button>
                <Button id="btn-thesis" className="is-hidden-mobile">MASTER THESIS</Button>
              </a>
            </Columns.Column>
          </Columns>
        }
        fullheight="is-fullheight"/>
      </div>
    );
}

export default About;
