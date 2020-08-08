import React from 'react';
import ReactTooltip from 'react-tooltip';
import { Columns, Column } from 'react-bootstrap';

const InfoSection = () => {
    return (
        <div className="columns">
            <div className="column">
                <ReactTooltip html={true}/>
                <strong data-tip={dataTip}>{label}</strong>
            </div>
            <div className="column">
                {value ? value : "N/A"}
            </div>
        </div>
    );
}

export default InfoSection;