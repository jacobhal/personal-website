import React from 'react'

import MainJumbotron from '../../components/MainJumbotron'

import { Container, Card, CardDeck } from 'react-bootstrap'
import { Helmet } from 'react-helmet'

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - Fullstack developer</title>
                <meta
                    name="description"
                    content="The personal website of Jacob Hallman - A fullstack developer. 
            Interests include web development, app development, machine learning and learning new things in general.
            This website contains my resume, personal projects, my master's thesis and more."
                />
            </Helmet>
            <MainJumbotron
                title="JACOB HALLMAN"
                subtitle="I'm always ready for new challenges"
                backgroundClass="has-bg-img-keyboard"
            />
            <Container fluid className="mb-5">
                <CardDeck>
                    <Card className="text-center">
                        <Card.Title className="card-header">
                            <span className="icon big-icon">
                                <i className="fa fa-database"></i>
                            </span>
                        </Card.Title>
                        <Card.Body>
                            <h3 className="text-center">Developer</h3>I have
                            always been interested in technology and how it
                            keeps changing our world.
                            <h5 className="text-center">
                                Programming languages
                            </h5>
                            Python, C++, Java, C#, Clojure.
                            <h5 className="text-center">
                                IDEs + machine learning libraries I have used
                            </h5>
                            <ul className="is-unstyled">
                                <li>Atom</li>
                                <li>VSCode</li>
                                <li>Visual Studio</li>
                                <li>IntellIJ</li>
                                <li>Android Studio</li>
                                <li>Pytorch</li>
                                <li>Scikit-learn</li>
                                <li>Tensorflow (Keras)</li>
                                <li>Skorch</li>
                                <li>LIME</li>
                                <li>H2O</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className="text-center">
                        <Card.Title className="card-header">
                            <span className="icon big-icon">
                                <i className="fa fa-cogs"></i>
                            </span>
                        </Card.Title>
                        <Card.Body>
                            <h3 className="text-center">Problem solver</h3>I
                            like to dive into new challenges and problems and
                            can't get them out of my head until they are solved.
                            Since a few years back I have also been an avid user
                            of Mac OSX.
                            <h5 className="text-center">Operating Systems</h5>
                            Windows, Ubuntu, Mac OSX.
                            <h5 className="text-center">
                                Useful development tools that I have experience
                                with
                            </h5>
                            <ul className="is-unstyled">
                                <li>Git + Github</li>
                                <li>TFS/Azure DevOps</li>
                                <li>YAML Pipelines</li>
                                <li>Octopus Deploy</li>
                                <li>SQL Server</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    <Card className="text-center">
                        <Card.Title className="card-header">
                            <span className="icon big-icon">
                                <i className="fa fa-copy"></i>
                            </span>
                        </Card.Title>
                        <Card.Body>
                            <h3 className="text-center">
                                Full-stack Developer
                            </h3>
                            During my education I have been interested in
                            back-end as well as front-end programming. Below is
                            a list of programming languages and tools of a more
                            web-related nature that I have used.
                            <h5 className="text-center">Web languages</h5>
                            HTML, CSS, JavaScript/JQuery, PHP, XPath.
                            <h5 className="text-center">Web tools</h5>
                            <ul className="is-unstyled">
                                <li>Vue</li>
                                <li>React</li>
                                <li>React Testing Library</li>
                                <li>Angular 2</li>
                                <li>Bootstrap</li>
                                <li>Bulma</li>
                                <li>Materialize</li>
                                <li>Typescript</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </CardDeck>
            </Container>
        </div>
    )
}

export default Home
