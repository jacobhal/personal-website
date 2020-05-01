import React from 'react';

const InfoRow = ({label, value}) => {
    return (
        <div className="columns">
            <div className="column">
                <strong>{label}</strong>
            </div>
            <div className="column">
                {value ? value : "N/A"}
            </div>
        </div>
    );
}

export default InfoRow;