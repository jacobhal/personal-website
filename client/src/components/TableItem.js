import React from 'react';

const TableItem = props => {
    return (
            <tr>
                <td><a className="projects-table-title" href={props.route}>{props.title}</a></td>
                <td>{props.description}</td>
                <td>{props.status}</td>
            </tr>
    );
}

export default TableItem;