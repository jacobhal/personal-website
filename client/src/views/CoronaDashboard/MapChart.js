import React, { memo } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import moment from 'moment';
import { getDayStatus, getFirstDayStatus, rounded, getCoronaCasesPer1MPopulation } from './coronaParser';
import { CountryMapper } from './countryMapper';
import { scaleLinear } from "d3-scale"

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({ setTooltipContent, coronaData }) => {

  let maxDeaths = 0;
  for (const key in coronaData) {
    let lastReport = coronaData[key][coronaData[key].length - 1];
    if (lastReport['deaths'] > maxDeaths) {
      maxDeaths = lastReport['deaths'];
    }
  }

  const minColor = "rgb(189, 129, 129)";
  const maxColor = "rgb(255, 0, 0)";
  const inactiveColor = "rgb(107, 104, 104)";
  const hoverColor = "rgb(97, 117, 172)";
  const minValue = 0;
  const maxValue = maxDeaths/100;

  const customScale = scaleLinear()
  .domain([minValue,maxValue])
  .range([minColor,maxColor]);

  return (
    <>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const { NAME, POP_EST } = geo.properties;
                let currentCountry = coronaData[NAME];
                if (currentCountry === undefined) {
                    currentCountry = coronaData[CountryMapper[NAME]];
                }
                if (currentCountry !== undefined) {
                  let currentDate = moment().format("YYYY-MM-DD");  
                         
                  // var firstReport = getFirstDayStatus(currentCountry);
                  // var lastReport = getDayStatus(currentCountry, currentDate);
                  var lastReport = currentCountry[Object.keys(currentCountry).length - 1];
                  // if (lastReport === null) {
                  //     let previousDate = moment().subtract(1, 'days').format("YYYY-M-DD"); 
                  //     lastReport = getDayStatus(currentCountry, previousDate);
                  // }
                  var coronaCasesPer1000000population = (lastReport['confirmed']/POP_EST) * 1000000;
                  var coronaDeathsPer1000000population = (lastReport['deaths']/POP_EST) * 1000000;
                }
                return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {         
                    if (currentCountry !== undefined) {        
                        setTooltipContent(`${NAME} <br />
                                            Population: ${rounded(POP_EST)} <br />
                                            Confirmed cases: ${lastReport['confirmed']} <br />
                                            Confirmed cases per 1 million inhabitants: ${Math.round(coronaCasesPer1000000population)} <br />
                                            Confirmed deaths: ${lastReport['deaths']} <br />
                                            Confirmed deaths per 1 million inhabitants: ${Math.round(coronaDeathsPer1000000population)} <br />
                                            Recovered: ${lastReport['recovered']}
                                            `);
                    } else {
                        // setTooltipContent(`${NAME} <br />
                        //                    Population: ${rounded(POP_EST)} <br />
                        //                    No Corona data available`);
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: currentCountry === undefined ? `${inactiveColor}` : (currentCountry ? customScale(coronaDeathsPer1000000population) : "#ECEFF1"),
                      outline: "none"
                    },
                    hover: {
                      fill: currentCountry === undefined ? `${inactiveColor}` : `${hoverColor}`,
                      outline: "none"
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none"
                    }
                  }}
                />
                )})
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
