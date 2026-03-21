import React, { useState, useEffect } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import axios from 'axios'

import { NavBar } from '../../components/NavBar'
import MapChart from './MapChart'
import {
    Box,
    Container,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
} from '@mui/material'
import DefaultLoader from './../../components/DefaultLoader'
import './../../styles/coronaDashboard.scss'
import {
    getPercent,
    getCoronaCasesPer1MPopulation,
    rounded,
} from './coronaParser'
import { CountryMapper } from './countryMapper'
import Errormessage from './../../components/Errormessage'
import { Helmet } from 'react-helmet'

interface CountryData {
    name: string
    confirmed: string
    population: string
    coronaCasesPer1000000population: string
    coronaDeathsPer1000000population: string
    coronaRecoveredPercent: string
    coronaDeathsPercent: string
    coronaCasesPopulationPercent: string
    coronaDeathsPopulationPercent: string
}

const CoronaDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null)
    const [fullData, setFullData] = useState<CountryData[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mapContent, setMapContent] = useState('')
    const [error, setError] = useState<Error | null>(null)
    const [tabValue, setTabValue] = useState(0)
    const apiURL = 'https://pomber.github.io/covid19/timeseries.json'
    const geoJSON = 'geoData.json'

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)

            axios
                .all([axios.get(apiURL), axios.get(geoJSON)])
                .then(
                    axios.spread((coronaResult: any, geoResult: any) => {
                        let gD =
                            geoResult.data.objects.ne_110m_admin_0_countries
                                .geometries
                        setData(coronaResult.data)
                        let finalDataSet: CountryData[] = []

                        gD.forEach((geo: any) => {
                            let currentCountryGeoData = geo.properties
                            let currentCountryCoronaData =
                                coronaResult.data[currentCountryGeoData.NAME]
                            if (currentCountryCoronaData === undefined) {
                                currentCountryCoronaData =
                                    coronaResult.data[
                                        CountryMapper[
                                            currentCountryGeoData.NAME
                                        ]
                                    ]
                            }

                            if (currentCountryCoronaData !== undefined) {
                                let lastReport =
                                    currentCountryCoronaData[
                                        Object.keys(currentCountryCoronaData)
                                            .length - 1
                                    ]

                                let coronaCasesPer1000000population =
                                    getCoronaCasesPer1MPopulation(
                                        lastReport,
                                        currentCountryGeoData.POP_EST,
                                        'confirmed'
                                    )
                                let coronaDeathsPer1000000population =
                                    getCoronaCasesPer1MPopulation(
                                        lastReport,
                                        currentCountryGeoData.POP_EST,
                                        'deaths'
                                    )
                                let coronaRecoveredPercent = getPercent(
                                    lastReport['confirmed'],
                                    lastReport['recovered']
                                )
                                let coronaDeathsPercent = getPercent(
                                    lastReport['confirmed'],
                                    lastReport['deaths']
                                )
                                let coronaCasesPopulationPercent = getPercent(
                                    currentCountryGeoData.POP_EST,
                                    lastReport['confirmed']
                                )
                                let coronaDeathsPopulationPercent = getPercent(
                                    currentCountryGeoData.POP_EST,
                                    lastReport['deaths']
                                )

                                finalDataSet.push({
                                    name: currentCountryGeoData.NAME,
                                    confirmed:
                                        lastReport['confirmed'] +
                                        ' cases & ' +
                                        lastReport['deaths'] +
                                        ' deaths',
                                    population: rounded(
                                        currentCountryGeoData.POP_EST
                                    ),
                                    coronaCasesPer1000000population,
                                    coronaDeathsPer1000000population,
                                    coronaRecoveredPercent,
                                    coronaDeathsPercent,
                                    coronaCasesPopulationPercent,
                                    coronaDeathsPopulationPercent,
                                })
                            }
                        })
                        setFullData(finalDataSet)
                        setIsLoading(false)
                    })
                )
                .catch((err: Error) => {
                    setError(err)
                    setIsLoading(false)
                })
        }
        fetchData()
    }, [])

    const columns = [
        { field: 'name', label: 'Country' },
        { field: 'confirmed', label: 'Cases & deaths' },
        { field: 'population', label: 'Population' },
        { field: 'coronaCasesPer1000000population', label: 'Cases/1M pop' },
        { field: 'coronaDeathsPer1000000population', label: 'Deaths/1M pop' },
        { field: 'coronaRecoveredPercent', label: 'Recovered (%)' },
        { field: 'coronaDeathsPercent', label: 'Deaths (%)' },
    ]

    return (
        <div>
            <Helmet>
                <title>Jacob Hallman - Corona dashboard</title>
                <meta
                    name="description"
                    content="A corona dashboard that compares the COVID-19 situation in different countries. 
                See an overview using the map view or compare different countries using various metrics in the table view."
                />
            </Helmet>
            <NavBar noImage={true} />
            <Container maxWidth={false} sx={{ pb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_, newValue) => setTabValue(newValue)}
                        className="corona-tab"
                    >
                        <Tab label="Map" />
                        <Tab label="Table" />
                    </Tabs>
                </Box>
                {tabValue === 0 && (
                    <Box sx={{ mt: 2 }}>
                        {!isLoading && !error ? (
                            <div style={{ border: '2px solid #000' }}>
                                <MapChart
                                    setTooltipContent={setMapContent}
                                    coronaData={data}
                                />
                                <ReactTooltip id="map-tooltip" />
                            </div>
                        ) : error !== null ? (
                            <Errormessage title="Error">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader />
                        )}
                    </Box>
                )}
                {tabValue === 1 && (
                    <Box sx={{ mt: 2 }}>
                        {!isLoading && !error && fullData ? (
                            <TableContainer component={Paper}>
                                <Table className="corona-table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((col) => (
                                                <TableCell key={col.field}>
                                                    {col.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {fullData.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell>{row.confirmed}</TableCell>
                                                <TableCell>{row.population}</TableCell>
                                                <TableCell>{row.coronaCasesPer1000000population}</TableCell>
                                                <TableCell>{row.coronaDeathsPer1000000population}</TableCell>
                                                <TableCell>{row.coronaRecoveredPercent}</TableCell>
                                                <TableCell>{row.coronaDeathsPercent}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : error !== null ? (
                            <Errormessage title="Error">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader />
                        )}
                    </Box>
                )}
            </Container>
        </div>
    )
}

export default CoronaDashboard
