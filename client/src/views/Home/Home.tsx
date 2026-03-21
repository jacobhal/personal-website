import React, { Suspense, lazy, useRef } from 'react'

import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
} from '@mui/material'
import { Helmet } from 'react-helmet'
import MainJumbotron from '../../components/MainJumbotron'
import DefaultLoader from './../../components/DefaultLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDatabase, faCogs, faCopy } from '@fortawesome/free-solid-svg-icons'

const CardDeck = lazy(() => import('./../../components/CardDeckRelay'))

const Home: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null)

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
                scrollRef={containerRef}
            />
            <Container maxWidth={false} sx={{ pb: 3 }} ref={containerRef}>
                <Suspense fallback={<DefaultLoader />}>
                    <CardDeck>
                        <Card sx={{ textAlign: 'center' }}>
                            <Box className="card-header" sx={{ p: 2 }}>
                                <span className="icon big-icon">
                                    <FontAwesomeIcon icon={faDatabase} />
                                </span>
                            </Box>
                            <CardContent>
                                <Typography variant="h5" sx={{ mt: 3, mb: 4 }}>
                                    Developer
                                </Typography>
                                I have always been interested in technology and
                                how it keeps changing our world. More often than
                                not I have some side projects or courses that I
                                work on during my free time.
                                <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                                    Programming languages
                                </Typography>
                                Python, C++, Java, C# (.NET & WPF), Clojure
                                <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                                    IDE:s & ML Libraries
                                </Typography>
                                <ul className="is-unstyled">
                                    <li>VSCode & Visual Studio (Main editors)</li>
                                    <li>Atom/Sublime</li>
                                    <li>IntellIJ</li>
                                    <li>Android Studio</li>
                                    <li>Pytorch</li>
                                    <li>Scikit-learn</li>
                                    <li>Tensorflow (Keras)</li>
                                    <li>Skorch</li>
                                    <li>LIME</li>
                                    <li>H2O</li>
                                    <li>SQL Server</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card sx={{ textAlign: 'center' }}>
                            <Box className="card-header" sx={{ p: 2 }}>
                                <span className="icon big-icon">
                                    <FontAwesomeIcon icon={faCogs} />
                                </span>
                            </Box>
                            <CardContent>
                                <Typography variant="h5" sx={{ mt: 3, mb: 4 }}>
                                    Problem solver
                                </Typography>
                                I like to dive into new challenges and problems
                                and can't get them out of my head until they are
                                solved. I am also an avid user of Mac OSX for
                                development on my free time, especially web
                                development.
                                <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                                    Operating Systems
                                </Typography>
                                Windows, Ubuntu, Mac OSX
                                <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                                    Version Control & DevOps Tools
                                </Typography>
                                <ul className="is-unstyled">
                                    <li>Git + Github</li>
                                    <li>Git Hooks</li>
                                    <li>TFS/Azure DevOps</li>
                                    <li>YAML Pipelines</li>
                                    <li>Octopus Deploy</li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card sx={{ textAlign: 'center' }}>
                            <Box className="card-header" sx={{ p: 2 }}>
                                <span className="icon big-icon">
                                    <FontAwesomeIcon icon={faCopy} />
                                </span>
                            </Box>
                            <CardContent>
                                <Typography variant="h5" sx={{ mt: 3, mb: 4 }}>
                                    Full-stack Developer
                                </Typography>
                                During my education I have been interested in
                                back-end as well as front-end programming. Below
                                is a list of programming languages and tools of
                                a more web-related nature that I have used.
                                <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                                    Web languages
                                </Typography>
                                HTML, CSS, JavaScript/JQuery/TypeScript, PHP,
                                XPath
                                <Typography variant="h6" sx={{ mt: 4, mb: 4 }}>
                                    Web Tools
                                </Typography>
                                <ul className="is-unstyled">
                                    <li>Vue</li>
                                    <li>React</li>
                                    <li>React Testing Library</li>
                                    <li>Angular 2</li>
                                    <li>Bootstrap</li>
                                    <li>Bulma</li>
                                    <li>Materialize</li>
                                    <li>ESLint & Prettier</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </CardDeck>
                </Suspense>
            </Container>
        </div>
    )
}

export default Home
