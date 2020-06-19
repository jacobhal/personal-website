import React from 'react';

import MainHero from '../../components/MainHero';
import Table from './components/ProjectTable';

import { Section, Container } from 'react-bulma-components/full';


export default function Portfolio() {
    const projectStatus = {
        TODO:   "In development",
        FINISHED:  "Finished",
        ABANDONED: "Abandoned"
    };
    let projects = [
        {
            id: 1,
            title: "Stock predictor",
            route: "/stockpredictor",
            description: "Financial market predictor using Machine learning and realtime data Stock API:s. A separate API" + 
             " was deployed to Heroku using Flask + MySQL which is where the data actual data fetching occurrs. The financial API:s" +
             " being used are free versions of Yahoo Finance and Alphavantage.",
            status: projectStatus.TODO
        },
        {
            id: 2,
            title: "React playground",
            route: "/react-playground",
            description: "This is a playground for exploring new React features since this entire website is built with React.",
            status: projectStatus.FINISHED
        },
        {
            id: 3,
            title: "Corona dashboard",
            route: "/corona-dashboard",
            description: "A live update corona dashboard using data from John Hopkins.",
            status: projectStatus.FINISHED
        },
        {
            id: 4,
            title: "Game review website",
            route: "http://www.codehalls.com",
            description: "An old school project built with Laravel and PHP (not responsive).",
            status: projectStatus.FINISHED
        }
    ]
    return (
        <div>
            <Helmet>
            <title>Jacob Hallman - Portfolio of personal web projects</title>
            <meta name="description" content="The personal web portfolio of Jacob Hallman includes various personal projects that I have been working on in my freetime. 
                The projects ranges from exploring third-party libraries to implementing ideas that are on my mind." />
            </Helmet>
            <MainHero title="PERSONAL PROJECTS" subtitle="Check out some passion projects of mine" background="has-bg-img-bulb" />
            <Section>
                <Container>
                <h1 className="title">My projects</h1>
                < Table projects={projects}/>
                </Container>
            </Section>
        </div>
    );
}
