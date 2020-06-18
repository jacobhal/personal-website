import React, {useState, useEffect, useContext, useMemo, useRef, useReducer, useCallback} from 'react';

import { NavBar } from '../../components/NavBar';
import dracula from 'prism-react-renderer/themes/dracula';
import nightOwl from "prism-react-renderer/themes/nightOwl";
import './../../styles/reactPlayground.css';

import { Hero, Section, Container} from 'react-bulma-components/full';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live'

const scope = {useState, useEffect, useContext, useMemo, useRef, useReducer, useCallback};

const ReactPlayground = () => {

    const exampleCode = `() => {
        const [count, setCount] = useState(0)

        useEffect(() => {
            // Called whenever count is modified

            // We can return a function in order to perform "cleanup logic"
            return function cleanup() {
                // Unsubscribe logic goes here
              };
        }, [count])
        
        return (
            <div>
                <button className="button is-primary" onClick={() => setCount(prevCount => prevCount + 1)}>
                    Clicked {count} times
                </button>
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
                    <p style={{marginBottom: '10px'}}>{"Available hooks - {useState, useEffect, useContext, useMemo, useRef, useReducer, useCallback}. Basic bulma css modifiers available."}</p>
                    <LiveProvider scope={scope} theme={dracula} code={exampleCode} >
                        <LiveEditor className="content"
                         style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 16,
                          }}
                         />
                        <LiveError />
                        <LivePreview />
                    </LiveProvider>
                </Container>
            </Section>
        </div>
    )
};

export default ReactPlayground;