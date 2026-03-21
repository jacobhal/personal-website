import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material'
import ProjectTableItem from './ProjectTableItem'

interface Project {
    id: string
    title: string
    route: string
    description: string
    status: string
}

interface ProjectTableProps {
    projects: Project[]
    tableFirstColumnTitle: string
}

const ProjectTable: React.FC<ProjectTableProps> = (props) => {
    return (
        <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>
                            {props.tableFirstColumnTitle}
                        </TableCell>
                        <TableCell sx={{ width: '65%', fontWeight: 'bold' }}>
                            Description
                        </TableCell>
                        <TableCell sx={{ width: '15%', fontWeight: 'bold' }}>
                            Status
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.projects.map((project) => (
                        <ProjectTableItem
                            key={project.id}
                            title={project.title}
                            route={project.route}
                            description={project.description}
                            status={project.status}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ProjectTable