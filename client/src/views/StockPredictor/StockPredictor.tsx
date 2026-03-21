import React, { useState, useEffect } from 'react'

import { NavBar } from '../../components/NavBar'
import StockForm from './components/StockForm'
import StockOverview from './components/StockOverview'
import StockTable from './components/StockTable'
import {
    Container,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material'
import DefaultLoader from './../../components/DefaultLoader'
import Errormessage from './../../components/Errormessage'
import { Helmet } from 'react-helmet'
import './../../styles/stockPredictor.scss'
import APIServiceUser from './APIServiceUser'

const StockPredictor: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [dataFetchOption, setDataFetchOption] = useState('Equity')
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [equity, setEquity] = useState<string>('')
    const [searchResult, setSearchResult] = useState<any>()
    const [companyInfo, setCompanyInfo] = useState<any>()
    const [error, setError] = useState<any>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        if (dataFetchOption === 'Search') {
            const res = await APIServiceUser.fetchSearch(searchTerm)
            setSearchResult(res)
        } else if (dataFetchOption === 'Equity') {
            try {
                const info = await APIServiceUser.fetchCompanyInfo(equity)
                setCompanyInfo(info)
            } catch (err) {
                setError(err)
            }
        }
    }

    useEffect(() => {
        setIsLoading(false)
    }, [searchResult, companyInfo])

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
            <Container sx={{ pb: 3 }}>
                <h1 className="title">Fetch stock data</h1>
                <p>
                    Search either by keywords to get a list of companies or
                    specify a stock symbol directly to get information about the
                    company.
                </p>

                <FormControl>
                    <RadioGroup
                        value={dataFetchOption}
                        onChange={(e) => setDataFetchOption(e.target.value)}
                        name="datafetch"
                    >
                        <FormControlLabel
                            value="Search"
                            control={<Radio />}
                            label="Search"
                        />
                        <FormControlLabel
                            value="Equity"
                            control={<Radio />}
                            label="Equity"
                        />
                    </RadioGroup>
                </FormControl>

                {dataFetchOption === 'Equity' && (
                    <div>
                        <StockForm
                            formId="fetch-information-form"
                            inputId="fetch-information-input"
                            placeholder="Enter a stock symbol..."
                            buttonValue="Fetch information"
                            onChangeFunc={(e) => setEquity(e.target.value)}
                            handleSubmitFunc={handleSubmit}
                        />
                        {!isLoading && !error ? (
                            companyInfo !== undefined ? (
                                <StockOverview data={companyInfo} />
                            ) : null
                        ) : error !== null ? (
                            <Errormessage title="Error">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader />
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
                            handleSubmitFunc={handleSubmit}
                        />
                        {!isLoading && !error ? (
                            searchResult !== undefined ? (
                                <StockTable data={searchResult} />
                            ) : null
                        ) : error !== null ? (
                            <Errormessage title="Error">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader />
                        )}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default StockPredictor
