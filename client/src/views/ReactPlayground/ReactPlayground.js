import React, {
    useState,
    useEffect,
    useContext,
    useMemo,
    useRef,
    useReducer,
    useCallback,
} from 'react'

import { NavBar } from '../../components/NavBar'
import dracula from 'prism-react-renderer/themes/dracula'
import nightOwl from 'prism-react-renderer/themes/nightOwl'
import './../../styles/reactPlayground.css'

import { Helmet } from 'react-helmet'
import { Jumbotron, Container } from 'react-bootstrap'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

const scope = {
    useState,
    useEffect,
    useContext,
    useMemo,
    useRef,
    useReducer,
    useCallback,
}

const ReactPlayground = () => {
    const exampleCode = `() => {
        const [count, setCount] = useState(0)
        const numbers = [1, 2, 3, 4, 5]
        const numbersMapped = numbers.map( (number, i) => <li key={i}>{number * 2}</li> ) // [2, 4, 6, 8, 10]
        const numbersFiltered = numbers.filter( (number) => number % 2 == 0) // [2, 4]
        const reducerFunc = (accumulator, currentValue) => accumulator + currentValue;
        const numbersReduced = numbers.reduce(reducerFunc) // 15

        useEffect(() => {
            return function cleanup() {} // We can return a function in order to unsubcribe events
        }, [count]) // Called whenever count is modified because we specified count in the dependency array  
        
        return (
            <div>
                <button className="btn btn-primary mt-2" onClick={() => setCount(prevCount => prevCount + 1)}>
                    Clicked {count} times
                </button>
            </div>
        )
}`

    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - React playground</title>
                <meta
                    name="description"
                    content="This is a small playground that can be used to explore new react features. Most of the hooks provided by react are available as well as the basic Bulma CSS classes."
                />
            </Helmet>
            <NavBar noImage={true} />
            <Container>
                <h1 className="title">React playground</h1>
                <p style={{ marginBottom: '10px' }}>
                    {
                        'Available hooks - {useState, useEffect, useContext, useMemo, useRef, useReducer, useCallback}. Basic Bulma CSS modifiers are available.'
                    }
                </p>
                <LiveProvider scope={scope} theme={dracula} code={exampleCode}>
                    <LiveEditor
                        className="content"
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 16,
                        }}
                    />
                    <LiveError />
                    <LivePreview />
                </LiveProvider>
            </Container>
        </div>
    )
}

export default ReactPlayground
