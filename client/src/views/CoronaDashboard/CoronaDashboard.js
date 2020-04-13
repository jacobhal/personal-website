import React, { useState, useEffect } from 'react';
import ReactTooltip from "react-tooltip";
import axios from 'axios';

import { NavBar } from '../../components/NavBar';
import MapChart from "./MapChart";
import { Hero, Section, Container, Loader, Heading, } from 'react-bulma-components/full';

const CoronaDashboard = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapContent, setMapContent] = useState("");
    const apiURL = "https://pomber.github.io/covid19/timeseries.json";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await axios(apiURL);
            setData(result.data);
            setIsLoading(false);
        };
        fetchData();
      }, []);

    return (
        <div>
            <Hero color="black" className="navbar-projects">
                <Hero.Head>
                    <NavBar />
                </Hero.Head>
            </Hero>
            <Section>
                <Container>
                { !isLoading ? 
                //data["Sweden"][10]['confirmed'] 
                <div>
                    <MapChart setTooltipContent={setMapContent} />
                   {/* <ReactTooltip>{mapContent}</ReactTooltip> */}
                </div>
                : 
                    <div>
                        <Heading className="has-text-centered subtitle-style" subtitle>
                        Fetching data...
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
                    </div> }
                </Container>
            </Section>
        </div>
    )
};

export default CoronaDashboard;