import React from 'react';
// import React, { useState, useEffect, useRef } from 'react';

import { NavBar } from '../../components/NavBar';

import { Hero, Section, Container} from 'react-bulma-components/full';

const ReactPlayground = () => {
    return (
        <div>
            <Hero color="black" className="navbar-projects">
                <Hero.Head>
                    <NavBar />
                </Hero.Head>
            </Hero>
            <Section>
                <Container>
                <h1 className="title">React playground</h1>  
                </Container>
            </Section>
        </div>
    )
};

export default ReactPlayground;