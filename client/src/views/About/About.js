import React from 'react';

import MainHero from '../.././components/MainHero';

import { Columns, Button } from 'react-bulma-components/full';

const About = props => {
    return (
      <div>
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
          </Columns>
        }
        fullheight="is-fullheight"/>
      </div>
    );
}

export default About;
