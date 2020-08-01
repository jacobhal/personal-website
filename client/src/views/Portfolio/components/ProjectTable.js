import React from 'react';

import TableItem from './ProjectTableItem';

export default function ProjectTable(props) {
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
        <table className="table" style={{width: '100%'}}>
            <thead>
                <tr>
                    <td className="has-text-weight-bold" style={{width: '20%'}}>{props.tableFirstColumnTitle}</td>
                    <td className="has-text-weight-bold" style={{width: '65%'}}>Description</td>
                    <td className="has-text-weight-bold" style={{width: '15%'}}>Status</td>
                </tr>
            </thead>
            <tbody>
                {tableItems}
            </tbody>
        </table>
    );
};