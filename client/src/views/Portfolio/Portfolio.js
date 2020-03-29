import React from 'react';

import MainHero from '../../components/MainHero';
import Table from './components/ProjectTable';

import { Section, Container } from 'react-bulma-components/full';


export default function Portfolio() {
    const projectStatus = {
        TODO:   "In development",
        FINISHED:  "Complete",
        ABANDONED: "Abandoned"
    };
    let projects = [
        {
            id: 1,
            title: "Stock predictor",
            route: "/stockpredictor",
            description: "Financial market predictor using Machine learning and realtime data Stock API:s",
            status: projectStatus.TODO
        },
        {
            id: 2,
            title: "React playground",
            route: "/react-playground",
            description: "This is a playground for exploring new React features since this entire website is built with React",
            status: projectStatus.TODO
        }
    ]
    return (
        <div>
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
