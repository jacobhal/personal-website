import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import moment from 'moment';
import { getDayStatus, getFirstDayStatus } from './coronaParser';
import { CountryMapper } from './countryMapper';

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const MapChart = ({ setTooltipContent, coronaData }) => {
  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME, POP_EST } = geo.properties;
                    let currentCountry = coronaData[NAME];
                    console.log(coronaData);
                    if (currentCountry === undefined) {
                        currentCountry = coronaData[CountryMapper[NAME]];
                    }
                    if (currentCountry !== undefined) {
                        let currentDate = moment().format("YYYY-MM-DD");  
                         
                        let firstReport = getFirstDayStatus(currentCountry);
                        let lastReport = getDayStatus(currentCountry, currentDate);
                        if (lastReport === null) {
                            let previousDate = moment().subtract(1, 'days').format("YYYY-M-DD"); 
                            lastReport = getDayStatus(currentCountry, previousDate);
                        }
                        let coronaCasesPer1000000population = (lastReport['confirmed']/POP_EST) * 1000000;
                        let coronaDeathsPer1000000population = (lastReport['deaths']/POP_EST) * 1000000;
                        setTooltipContent(`${NAME} <br />
                                            Population: ${rounded(POP_EST)} <br />
                                            Confirmed cases: ${lastReport['confirmed']} <br />
                                            Confirmed cases per 1 million inhabitants: ${Math.round(coronaCasesPer1000000population)} <br />
                                            Confirmed deaths: ${lastReport['deaths']} <br />
                                            Confirmed deaths per 1 million inhabitants: ${Math.round(coronaDeathsPer1000000population)} <br />
                                            Recovered: ${lastReport['recovered']}

                                            `);
                    } else {
                        setTooltipContent(`${NAME} <br />
                                           Population: ${rounded(POP_EST)} <br />
                                           No Corona data available`);
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none"
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none"
                    }
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
