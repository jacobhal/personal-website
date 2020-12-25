import React, { useState, useEffect } from 'react'

// import { useInput } from './../../hooks/input-hook';
// import { useAPI } from './api-hook';

import { NavBar } from '../../components/NavBar'
import StockForm from './components/StockForm'
import StockOverview from './components/StockOverview'
import StockTable from './components/StockTable'
import { Container, Form } from 'react-bootstrap'
import DefaultLoader from './../../components/DefaultLoader'
import Errormessage from './../../components/Errormessage'
import { Helmet } from 'react-helmet'
import './../../styles/stockPredictor.scss'
// import API from '../../services/API';
import APIServiceUser from './APIServiceUser'

// const axios = require('axios');

const StockPredictor = () => {
    // const { value, bind, reset } = useInput('');
    const [isLoading, setIsLoading] = useState(false)
    const [dataFetchOption, setDataFetchOption] = useState('Equity')
    const [searchTerm, setSearchTerm] = useState()
    const [equity, setEquity] = useState()
    const [searchResult, setSearchResult] = useState() // Initial state value empty object
    const [companyInfo, setCompanyInfo] = useState()
    // const [companyHistory, setCompanyHistory] = useState();
    // const [companyHistoryAlpha, setCompanyHistoryAlpha] = useState();
    const [error, setError] = useState(null)

    // refs
    // const searchRef = useRef(null);
    // const equityRef = useRef(null);

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)
        if (dataFetchOption === 'Search') {
            var res = await APIServiceUser.fetchSearch(searchTerm)
            setSearchResult(res)
        } else if (dataFetchOption === 'Equity') {
            try {
                var companyInfo = await APIServiceUser.fetchCompanyInfo(equity)
                // var history = await APIServiceUser.fetchCompanyHistory(equity, 'max');
                setCompanyInfo(companyInfo)
                // setCompanyHistory(history);
            } catch (error) {
                setError(error)
            }
            // var tmp = await APIServiceUser.fetchCompanyHistoryAlpha(equity, 'TIME_SERIES_DAILY_ADJUSTED');
            // console.log(tmp);
        }
    }

    useEffect(() => {
        setIsLoading(false)
    }, [searchResult, companyInfo]) // Disable loading icon when searchResult or companyInfo is updated

    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - Stock predictor</title>
                <meta
                    name="description"
                    content="An ongoing project that uses multiple Stock APIs + machine learning in order to predict good buying opportunities on the stock market."
                />
            </Helmet>
            <NavBar noImage={true} />
            <Container>
                <h1 className="title">Fetch stock data</h1>
                <p>
                    Search either by keywords to get a list of companies or
                    specify a stock symbol directly to get information about the
                    company.
                </p>

                <Form>
                    <Form.Check
                        className="radio-value"
                        type="radio"
                        value="Search"
                        label="Search"
                        name="datafetch"
                        id="search-radio"
                        // onClick={() => searchRef.current.focus()}
                        onChange={() => setDataFetchOption('Search')}
                    />
                    <Form.Check
                        className="radio-value"
                        type="radio"
                        value="Equity"
                        name="datafetch"
                        label="Equity"
                        id="equity-radio"
                        defaultChecked
                        // onClick={() => equityRef.current.focus()}
                        onChange={() => setDataFetchOption('Equity')}
                    />
                </Form>

                {dataFetchOption === 'Equity' && (
                    <div>
                        <StockForm
                            formId="fetch-information-form"
                            inputId="fetch-information-input"
                            placeholder="Enter a stock symbol..."
                            buttonValue="Fetch information"
                            onChangeFunc={(e) => setEquity(e.target.value)}
                            // ref={equityRef}
                            handleSubmitFunc={handleSubmit}
                        />
                        {!isLoading && !error ? (
                            companyInfo !== undefined ? (
                                <StockOverview data={companyInfo} />
                            ) : (
                                ''
                            )
                        ) : error !== null ? (
                            <Errormessage title="Error" topMargin="20px">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader>Fetching data...</DefaultLoader>
                        )}
                    </div>
                )}

                {dataFetchOption === 'Search' && (
                    <div>
                        <StockForm
                            formId="searchForm"
                            inputId="searchbar"
                            placeholder="Enter a search string..."
                            buttonValue="Search"
                            onChangeFunc={(e) => setSearchTerm(e.target.value)}
                            // ref={searchRef}
                            handleSubmitFunc={handleSubmit}
                        />
                        {!isLoading && !error ? (
                            searchResult !== undefined ? (
                                <StockTable data={searchResult} />
                            ) : (
                                ''
                            )
                        ) : error !== null ? (
                            <Errormessage title="Error" topMargin="20px">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader>Fetching results...</DefaultLoader>
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default StockPredictor
