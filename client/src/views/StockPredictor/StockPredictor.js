import React, { useState, useEffect } from 'react';

import { NavBar } from '../../components/NavBar';
import { Hero, Section, Container } from 'react-bulma-components/full';
import API from '../../services/API';;


const StockPredictor = ()  => {
    const [stocks, setStocks] = useState({}) // Initial state value empty object
    
    async function fetchData() {
        const myApi = new API({ url:'https://restful-stock-api.herokuapp.com' })
        myApi.createEntity({ name: 'getmsg' })
        myApi.endpoints.getmsg.getAll({ params: {name: 'Jacob'} })
            .then(res => res.data)
            .then(data => setStocks(data)) //
    }

    useEffect(() => {
        fetchData();
    })
   const res = fetchData()
    return (
        <div>
            <Hero color="black" className="navbar-projects">
                <Hero.Head>
                    <NavBar />
                </Hero.Head>
            </Hero>
            <Section>
                <Container>
                    <h1 className="title">My API Data</h1>
                    { JSON.stringify(stocks) }
                </Container>
            </Section>
        </div>
    );
}

export default StockPredictor;
