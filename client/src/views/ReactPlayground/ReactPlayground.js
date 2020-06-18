import React, {useState, useEffect, useContext, useMemo, useRef, useReducer} from 'react';

import { NavBar } from '../../components/NavBar';
import dracula from 'prism-react-renderer/themes/dracula';
import nightOwl from "prism-react-renderer/themes/nightOwl";
import './../../styles/reactPlayground.css';

import { Hero, Section, Container} from 'react-bulma-components/full';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live'

const scope = {useState, useEffect, useContext, useMemo, useRef, useReducer};

const ReactPlayground = () => {

    const exampleCode = `() => {
        const [text, setText] = useState('Hello World!')
        return (
            <div>
                <strong>{text}</strong>
            </div>
        )
}`;

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
                    <LiveProvider scope={scope} theme={dracula} code={exampleCode} >
                        <LiveEditor className="content"
                         style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 16,
                          }}/>
                        <LiveError />
                        <LivePreview />
                    </LiveProvider>
                </Container>
            </Section>
        </div>
    )
};

export default ReactPlayground;