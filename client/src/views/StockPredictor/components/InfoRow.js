import React from 'react'
import ReactTooltip from 'react-tooltip'

const InfoRow = ({ label, value, dataTip }) => {
    return (
        <tr>
            <td className="text-center">
                <ReactTooltip html={true} />
                <p data-tip={dataTip}>{label}</p>
            </td>
            <td className="text-center">{value ? value : 'N/A'}</td>
        </tr>
    )
}

export default InfoRow
