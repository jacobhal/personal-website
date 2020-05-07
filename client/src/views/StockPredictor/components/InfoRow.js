import React from 'react';
import ReactTooltip from 'react-tooltip';

const InfoRow = ({label, value, dataTip}) => {
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

export default InfoRow;