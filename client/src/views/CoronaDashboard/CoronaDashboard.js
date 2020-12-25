import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import axios from 'axios'

import { NavBar } from '../../components/NavBar'
import MapChart from './MapChart'
import { Container } from 'react-bootstrap'
import DefaultLoader from './../../components/DefaultLoader'
import { Tab, Tabs } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import './../../styles/coronaDashboard.css'
// import moment from 'moment';
import {
    getPercent,
    getCoronaCasesPer1MPopulation,
    rounded,
} from './coronaParser'
import { CountryMapper } from './countryMapper'
import Errormessage from './../../components/Errormessage'
import { Helmet } from 'react-helmet'

const CoronaDashboard = () => {
    const [data, setData] = useState(null)
    // const [geoData, setGeoData] = useState(null);
    const [fullData, setFullData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mapContent, setMapContent] = useState('')
    const [error, setError] = useState(null)
    const apiURL = 'https://pomber.github.io/covid19/timeseries.json'
    // const geoURL = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
    const geoJSON = 'geoData.json'

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)

            axios
                .all([axios.get(apiURL), axios.get(geoJSON)])
                .then(
                    axios.spread((coronaResult, geoResult) => {
                        let gD =
                            geoResult.data.objects.ne_110m_admin_0_countries
                                .geometries
                        setData(coronaResult.data)
                        // setGeoData(gD);
                        // Construct the full dataset
                        let finalDataSet = []

                        gD.map((geo) => {
                            let currentCountryObj = {}
                            // Load current country geodata and corona data
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
                                // let currentDate = moment().format("YYYY-MM-DD");

                                // Fetch first and last corona day status
                                // let firstReport = getFirstDayStatus(currentCountryCoronaData);
                                // let lastReport = getDayStatus(currentCountryCoronaData, currentDate);
                                let lastReport =
                                    currentCountryCoronaData[
                                        Object.keys(currentCountryCoronaData)
                                            .length - 1
                                    ]
                                // if (lastReport === null) {
                                //     let previousDate = moment().subtract(1, 'days').format("YYYY-M-DD");
                                //     lastReport = getDayStatus(currentCountryCoronaData, previousDate);
                                //     console.log(lastReport);
                                // }

                                let coronaCasesPer1000000population = getCoronaCasesPer1MPopulation(
                                    lastReport,
                                    currentCountryGeoData.POP_EST,
                                    'confirmed'
                                )
                                let coronaDeathsPer1000000population = getCoronaCasesPer1MPopulation(
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

                                currentCountryObj = {
                                    name: currentCountryGeoData.NAME,
                                    confirmed:
                                        lastReport['confirmed'] +
                                        ' cases & ' +
                                        lastReport['deaths'] +
                                        ' deaths',
                                    population: rounded(
                                        currentCountryGeoData.POP_EST
                                    ),
                                    coronaCasesPer1000000population: coronaCasesPer1000000population,
                                    coronaDeathsPer1000000population: coronaDeathsPer1000000population,
                                    coronaRecoveredPercent: coronaRecoveredPercent,
                                    coronaDeathsPercent: coronaDeathsPercent,
                                    coronaCasesPopulationPercent: coronaCasesPopulationPercent,
                                    coronaDeathsPopulationPercent: coronaDeathsPopulationPercent,
                                }
                                finalDataSet.push(currentCountryObj)
                            } else {
                                // currentCountryObj = {
                                //     name: currentCountryGeoData.NAME,
                                //     population: rounded(currentCountryGeoData.POP_EST)
                                // }
                            }
                            return true
                        })
                        setFullData(finalDataSet)
                        setIsLoading(false)
                    })
                )
                .catch((err) => {
                    setError(err)
                    setIsLoading(false)
                })
        }
        fetchData()
    }, [])

    const columns = [
        {
            dataField: 'name',
            text: 'Country',
            sort: true,
        },
        {
            dataField: 'confirmed',
            text: 'Cases & deaths',
        },
        {
            dataField: 'population',
            text: 'Population',
        },
        {
            dataField: 'coronaCasesPer1000000population',
            text: 'Cases/1M pop',
            sort: true,
        },
        {
            dataField: 'coronaDeathsPer1000000population',
            text: 'Deaths/1M pop',
            sort: true,
        },
        {
            dataField: 'coronaRecoveredPercent',
            text: 'Recovered (%)',
            sort: true,
        },
        {
            dataField: 'coronaDeathsPercent',
            text: 'Deaths (%)',
            sort: true,
        },
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
            <Container fluid>
                <Tabs
                    defaultActiveKey="map"
                    className="corona-tab"
                    variant="tabs"
                >
                    <Tab
                        eventKey="map"
                        title="Map"
                        icon="fa-map"
                        isactive="is-active"
                    >
                        {!isLoading && !error ? (
                            //data["Sweden"][10]['confirmed']
                            <div style={{ border: '2px solid #000' }}>
                                <MapChart
                                    setTooltipContent={setMapContent}
                                    coronaData={data}
                                />
                                <ReactTooltip multiline={true} html={true}>
                                    {mapContent}
                                </ReactTooltip>
                            </div>
                        ) : error !== null ? (
                            <Errormessage title="Error">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader>Fetching data...</DefaultLoader>
                        )}
                    </Tab>
                    <Tab eventKey="table" title="Table" icon="fa-table">
                        {!isLoading && !error ? (
                            <BootstrapTable
                                className="corona-table"
                                keyField="name"
                                data={fullData}
                                columns={columns}
                            />
                        ) : error !== null ? (
                            <Errormessage title="Error">
                                Something went wrong!
                            </Errormessage>
                        ) : (
                            <DefaultLoader>Fetching data...</DefaultLoader>
                        )}
                    </Tab>
                </Tabs>
            </Container>
        </div>
    )
}

export default CoronaDashboard
