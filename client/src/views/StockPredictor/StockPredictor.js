import React, { useState, useEffect } from 'react';

// import { useInput } from './../../hooks/input-hook';
import { useAPI } from './api-hook';

import { NavBar } from '../../components/NavBar';
import StockForm from './../../components/StockForm';
import { Hero, Section, Container, Loader, Heading, } from 'react-bulma-components/full';
import API from '../../services/API';
import APIServiceUser from './APIServiceUser';
import StockOverview from '../../components/StockOverview';

const axios = require('axios');

const StockPredictor = ()  => {
    // const { value, bind, reset } = useInput('');
    const [isLoading, setIsLoading] = useState(false);
    const [dataFetchOption, setDataFetchOption] = useState('Equity');
    const [searchTerm, setSearchTerm] = useState();
    const [equity, setEquity] = useState();
    const [searchResult, setSearchResult] = useState(); // Initial state value empty object
    const [companyInfo, setCompanyInfo] = useState();
    const [companyHistory, setCompanyHistory] = useState();
    const [companyHistoryAlpha, setCompanyHistoryAlpha] = useState();
    
    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        if(dataFetchOption === 'Search') {
            var res = await APIServiceUser.fetchSearch(searchTerm);
            setSearchResult(res);
        }
        else if (dataFetchOption === 'Equity') {       
            var res = await APIServiceUser.fetchCompanyInfo(equity);
            setCompanyInfo(res);
            console.log(res['DATA']['INFO']);
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
                                value="Equity"
                                name="datafetch" 
                                defaultChecked
                                onChange={() => setDataFetchOption('Equity')}
                            />
                            Equity
                        </label>
                        <label className="radio">
                            <input 
                                className="radio-value" 
                                type="radio" 
                                value="Search"
                                name="datafetch" 
                                onChange={() => setDataFetchOption('Search')}
                            />
                            Search
                        </label>
                    </div>

                    {dataFetchOption === 'Equity' &&
                        <div>
                            <StockForm 
                                formId="fetch-information-form" 
                                inputId="fetch-information-input"
                                placeholder="Enter an equity..."
                                buttonValue="Fetch information"
                                onChangeFunc={e => setEquity(e.target.value)}
                                handleSubmitFunc={handleSubmit}
                            />
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
                                </div> : 
                                    companyInfo !== undefined ? <StockOverview data={companyInfo}/> : ''  }
                            </ul>
                        </div>
                    }


                    {dataFetchOption === 'Search' &&
                        <div>
                            <StockForm 
                                formId="searchForm" 
                                inputId="searchbar"
                                placeholder="Enter a search string..."
                                buttonValue="Search"
                                onChangeFunc={e => setSearchTerm(e.target.value)}
                                handleSubmitFunc={handleSubmit}
                            />
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
                </Container>
            </Section>
        </div>
    );
}

export default StockPredictor;
