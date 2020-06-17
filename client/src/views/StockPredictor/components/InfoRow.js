import React from 'react';
import ReactTooltip from 'react-tooltip';

const InfoRow = ({label, value, dataTip}) => {
    return (
        <div className="columns info-row">
            <div className="column has-text-centered">
                <ReactTooltip html={true}/>
                <strong data-tip={dataTip}>{label}</strong>
            </div>
            <div className="column has-text-centered">
                {value ? value : "N/A"}
            </div>
        </div>
    );
}

export default InfoRow;