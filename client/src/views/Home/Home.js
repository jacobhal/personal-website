import React from 'react';

import MainHero from '../.././components/MainHero';

import { Container, Card, Row } from 'react-bootstrap';
import { Helmet } from "react-helmet";

const Home = props => {
    return (
      <div>
        <Helmet>
          <title>Jacob Hallman - Fullstack developer</title>
          <meta name="description" content="The personal website of Jacob Hallman - A fullstack developer. 
            Interests include web development, app development, machine learning and learning new things in general.
            This website contains my resume, personal projects, my master's thesis and more." />
        </Helmet>
        <MainHero title="JACOB HALLMAN" subtitle="I'm always ready for new challenges" background="has-bg-img-keyboard" />
        <Container>
            <Row>
              <Card className="is-shady card-equal-height">
                <Card.Title className="card-header">
                    <span className="icon big-icon">
                      <i className="fa fa-database"></i>
                    </span>
                </Card.Title>
                <Card.Body>
                  <Card.Text className="has-text-centered">
                    <h1 className="has-text-centered" subtitle size={3}>
                      Developer
                    </h1>
                    I have always been interested in technology and how it keeps changing our world.
                    <h1 className="has-text-centered" subtitle size={6}>
                      Programming languages
                    </h1>
                    Python, C++, Java, C#, Clojure.
                    <h1 className="has-text-centered" subtitle size={6}>
                      IDEs + machine learning libraries I have used
                    </h1>
                    <ul className="is-unstyled">
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
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              <Card className="is-shady card-equal-height">
                <Card.Title className="card-header">
                    <span className="icon big-icon">
                      <i className="fa fa-cogs"></i>
                    </span>
                </Card.Title>
                <Card.Body>
                  <Card.Text className="has-text-centered">
                    <h1 className="has-text-centered" subtitle size={3}>
                      Problem solver
                    </h1>
                    I like to dive into new challenges and problems and can't get them out of my head until they are solved.
                    Since a few years back I have also been an avid user of Mac OSX.
                    <h1 className="has-text-centered" subtitle size={6}>
                      Operating Systems
                    </h1>
                    Windows, Ubuntu, Mac OSX.
                    <h1 className="has-text-centered" subtitle size={6}>
                      Useful development tools that I have experience with
                    </h1>
                    <ul className="is-unstyled">
                      <li>Git + Github</li>
                      <li>TFS/Azure DevOps</li>
                      <li>Octopus Deploy</li>
                      <li>SQL Server</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
            <Row>
              <Card className="is-shady card-equal-height">
                <Card.Title className="card-header">
                    <span className="icon big-icon">
                      <i className="fa fa-copy"></i>
                    </span>
                </Card.Title>
                <Card.Body>
                  <Card.Text className="has-text-centered">
                    <h1 className="has-text-centered" subtitle size={3}>
                      Full-stack Developer
                    </h1>
                    During my education I have been interested in back-end as well as front-end programming. Below
                    is a list of programming languages and tools of a more web-related nature that I have used.
                    <h1 className="has-text-centered" subtitle size={6}>
                      Web languages
                    </h1>
                    HTML, CSS, JavaScript/JQuery, PHP, XPath.
                    <h1 className="has-text-centered" subtitle size={6}>
                      Web tools
                    </h1>
                    <ul className="is-unstyled">
                      <li>Vue</li>
                      <li>React</li>
                      <li>Angular 2</li>
                      <li>Bootstrap</li>
                      <li>Bulma</li>
                      <li>Materialize</li>
                      <li>Typescript</li>
                    </ul>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
        </Container>
      </div>
    );
}

export default Home;
