import React from 'react'
import { Link, TableCell, TableRow } from '@mui/material'

interface ProjectTableItemProps {
    title: string
    route: string
    description: string
    status: string
}

const ProjectTableItem: React.FC<ProjectTableItemProps> = (props) => {
    return (
        <TableRow>
            <TableCell>
                <Link href={props.route} className="projects-table-title">
                    {props.title}
                </Link>
            </TableCell>
            <TableCell>{props.description}</TableCell>
            <TableCell>{props.status}</TableCell>
        </TableRow>
    )
}

export default ProjectTableItem