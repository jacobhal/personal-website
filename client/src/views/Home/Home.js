import React from 'react';

import MainHero from '../.././components/MainHero';

import { Heading, Section, Card, Content, Columns } from 'react-bulma-components/full';

const Home = props => {
    return (
      <div>
        <MainHero title="DEVELOPER" subtitle="I'm always ready for new challenges" background="has-bg-img-keyboard" />
        <Section>
          <Columns>
            <Columns.Column>
              <Card className="is-shady card-equal-height">
                <Card.Header className="card-header">
                    <span className="icon big-icon">
                      <i className="fa fa-database"></i>
                    </span>
                </Card.Header>
                <Card.Content>
                  <Content className="has-text-centered">
                    <Heading className="has-text-centered" subtitle size={3}>
                      Developer
                    </Heading>
                    I have always been interested in technology and how it keeps changing our world.
                    <Heading className="has-text-centered" subtitle size={6}>
                      Programming languages
                    </Heading>
                    Python, C++, Java, Clojure.
                    <Heading className="has-text-centered" subtitle size={6}>
                      Development tools + machine learning libraries used
                    </Heading>
                    <ul className="is-unstyled">
                      <li>Github</li>
                      <li>Atom</li>
                      <li>IntellIJ</li>
                      <li>Android Studio</li>
                      <li>Pytorch</li>
                      <li>Scikit-learn</li>
                      <li>Tensorflow (Keras)</li>
                      <li>Skorch</li>
                      <li>LIME</li>
                      <li>H2O</li>
                    </ul>
                  </Content>
                </Card.Content>
              </Card>
            </Columns.Column>
            <Columns.Column>
              <Card className="is-shady card-equal-height">
                <Card.Header className="card-header">
                    <span className="icon big-icon">
                      <i className="fa fa-apple"></i>
                    </span>
                </Card.Header>
                <Card.Content>
                  <Content className="has-text-centered">
                    <Heading className="has-text-centered" subtitle size={3}>
                      Problem solver
                    </Heading>
                    I like to dive into new challenges and problems and can't get them out of my head until they are solved.
                    Since a few years back I have also been an avid user of Mac OSX.
                    <Heading className="has-text-centered" subtitle size={6}>
                      Knowledge
                    </Heading>
                    Command line.
                    <Heading className="has-text-centered" subtitle size={6}>
                      Additional Operating Systems that I have experience with
                    </Heading>
                    <ul className="is-unstyled">
                      <li>Windows</li>
                      <li>Ubuntu</li>
                    </ul>
                  </Content>
                </Card.Content>
              </Card>
            </Columns.Column>
            <Columns.Column>
              <Card className="is-shady card-equal-height">
                <Card.Header className="card-header">
                    <span className="icon big-icon">
                      <i className="fa fa-copy"></i>
                    </span>
                </Card.Header>
                <Card.Content>
                  <Content className="has-text-centered">
                    <Heading className="has-text-centered" subtitle size={3}>
                      Full-stack Developer
                    </Heading>
                    During my education I have been interested in back-end as well as front-end programming. Below
                    is a list of programming languages and tools of a more web-related nature that I have used.
                    <Heading className="has-text-centered" subtitle size={6}>
                      Web languages
                    </Heading>
                    HTML, CSS, JavaScript/JQuery, PHP, XPath.
                    <Heading className="has-text-centered" subtitle size={6}>
                      Web tools
                    </Heading>
                    <ul className="is-unstyled">
                      <li>Vue</li>
                      <li>React</li>
                      <li>Angular 2</li>
                      <li>Bootstrap</li>
                      <li>Bulma</li>
                      <li>Materialize</li>
                      <li>MySQL</li>
                    </ul>
                  </Content>
                </Card.Content>
              </Card>
            </Columns.Column>
          </Columns>
        </Section>
      </div>
    );
}

export default Home;
