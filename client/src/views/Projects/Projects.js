import React from 'react';

import MainHero from '../.././components/MainHero';
import Table from '../.././components/Table';

import { Section, Container } from 'react-bulma-components/full';


export default function Projects() {
    const projectStatus = {
        TODO:   "In development",
        FINISHED:  "Complete",
        ABANDONED: "Abandoned"
    };
    let projects = [
        {
            id: 1,
            title: "Stock predictor",
            route: "/stockPredictor",
            description: "Financial market predictor using Machine learning and realtime data Stock API:s",
            status: projectStatus.TODO
        }
    ]
    return (
        <div>
            <MainHero title="PERSONAL PROJECTS" subtitle="Check out some projects of mine" background="has-bg-img-bulb" />
            <Section>
                <Container>
                <h1 className="title">List of my projects</h1>
                < Table projects={projects}/>
                </Container>
            </Section>
        </div>
    );
}
