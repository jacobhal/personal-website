import React, { useState, useEffect } from 'react';

// import { useInput } from './../../hooks/input-hook';
import { useAPI } from './api-hook';

import { NavBar } from '../../components/NavBar';
import { Hero, Section, Container, Loader, Heading, } from 'react-bulma-components/full';
import API from '../../services/API';;

const axios = require('axios');

const StockPredictor = ()  => {
    // const { value, bind, reset } = useInput('');
    const [isLoading, setIsLoading] = useState(false);
    const [dataFetchOption, setDataFetchOption] = useState('Search');
    const [searchTerm, setSearchTerm] = useState();
    const [equity, setEquity] = useState();
    const [searchResult, setSearchResult] = useState(); // Initial state value empty object
    const [companyInfo, setCompanyInfo] = useState();
    const [companyHistory, setCompanyHistory] = useState();
    const [companyHistoryAlpha, setCompanyHistoryAlpha] = useState();
    const myApi = new API({ url:'https://restful-stock-api.herokuapp.com' });

    async function fetchSearch(keywords) {
        myApi.createEntity({ name: 'search' });
        myApi.endpoints.search.getAll({ params: {keywords: keywords} })
            .then(res => res.data)
            .then(data => setSearchResult(data));
    }

    async function fetchCompanyInfo(equity) {
        myApi.createEntity({ name: 'getinfo' });
        myApi.endpoints.getinfo.getAll({ params: {equity: equity} })
            .then(res => res.data)
            .then(data => setCompanyInfo(data));
    }

    async function fetchCompanyHistory(equity, period) {
        myApi.createEntity({ name: 'gethistory' });
        myApi.endpoints.gethistory.getAll({ params: {equity: equity, period: period} })
            .then(res => res.data)
            .then(data => setCompanyHistory(data));
    }

    async function fetchCompanyHistoryAlpha(equity, func) {
        myApi.createEntity({ name: 'gethistoryalpha' });
        myApi.endpoints.gethistoryalpha.getAll({ params: {equity: equity, function: func} })
            .then(res => res.data)
            .then(data => setCompanyHistoryAlpha(data));
    }

    async function fetchTest(keywords) {
        axios.get(myApi.url)
        .then(setTimeout(function (response) {
            console.log(response);
        }), 3000);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        if(dataFetchOption === 'Search') {
            fetchSearch(searchTerm);
        }
        else if (dataFetchOption === 'Equity') {       
            fetchCompanyInfo(equity);
        }
    }

    useEffect(() => {
        setIsLoading(false);
      }, [searchResult, companyInfo]); // Disable loading icon when searchResult or companyInfo is updated
    
    return (
        <div>
            <Hero color="black" className="navbar-projects">
                <Hero.Head>
                    <NavBar />
                </Hero.Head>
            </Hero>
            <Section>
                <Container>
                    <h1 className="title">Fetch stock data</h1>  
                    <p>Search either by keywords to get a list of equities or specify an equity directly to get information about
                        the organization.</p>    
    
                    <div className="control radio-form">
                        <label className="radio">
                            <input 
                                className="radio-value" 
                                type="radio" 
                                value="Search"
                                name="datafetch" 
                                defaultChecked
                                onChange={() => setDataFetchOption('Search')}
                            />
                            Search
                        </label>
                        <label className="radio">
                            <input 
                                className="radio-value" 
                                type="radio" 
                                value="Equity"
                                name="datafetch" 
                                onChange={() => setDataFetchOption('Equity')}
                            />
                            Equity
                        </label>
                    </div>


                    {dataFetchOption === 'Search' &&
                        <div>
                            <form id="searchform" onSubmit={handleSubmit}>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            id="searchbar"
                                            placeholder="Enter a search string..."
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <div className="control">
                                        <button className="button" type="submit">Search</button>
                                    </div>
                                </div>
                            </form>
                            <ul>
                            { isLoading ?
                                <div>
                                    <Heading className="has-text-centered subtitle-style" subtitle>
                                    Fetching results...
                                    </Heading>
                                    <Loader
                                    className="loading-spinner"
                                    style={{
                                        width: 200,
                                        height: 200,
                                        border: '8px solid grey',
                                        borderTopColor: 'transparent',
                                        borderRightColor: 'transparent',
                                    }} />
                                </div>
                                : JSON.stringify(searchResult) }
                            </ul>
                        </div>
                    }


                    {dataFetchOption === 'Equity' &&
                        <div>
                            <form id="fetch-information-form" onSubmit={handleSubmit}>
                                <div className="field">
                                    <div className="control">
                                        <input
                                            className="input"
                                            type="text"
                                            id="fetch-information-input"
                                            placeholder="Enter an equity string..."
                                            onChange={e => setEquity(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="field">
                                    <div className="control">
                                        <button className="button" type="submit">Fetch information</button>
                                    </div>
                                </div>
                            </form>
                            <ul>
                                { isLoading ?
                                <div>
                                    <Heading className="has-text-centered subtitle-style" subtitle>
                                    Fetching results...
                                    </Heading>
                                    <Loader
                                    className="loading-spinner"
                                    style={{
                                        width: 200,
                                        height: 200,
                                        border: '8px solid grey',
                                        borderTopColor: 'transparent',
                                        borderRightColor: 'transparent',
                                    }} />
                                </div> : JSON.stringify(companyInfo)  }
                            </ul>
                        </div>
                    }
                </Container>
            </Section>
        </div>
    );
}

export default StockPredictor;
