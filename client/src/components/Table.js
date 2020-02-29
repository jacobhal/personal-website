import React from 'react';

import TableItem from './TableItem';

export default function Table(props) {
    const tableItems = props.projects.map((project) => (
        <TableItem 
            key={project.id}
            title={project.title}
            route={project.route} 
            description={project.description} 
            status={project.status}
        />
    ))
    return (
    <table className="table">
        <thead>
            <tr>
                <td className="has-text-weight-bold">Project</td>
                <td className="has-text-weight-bold">Description</td>
                <td className="has-text-weight-bold">Status</td>
            </tr>
        </thead>
        <tbody>
            {tableItems}
        </tbody>
    </table>
    );
};