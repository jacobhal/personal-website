import React from 'react'
import { Grid } from '@mui/material'
import MemoizedProjectImage from './ProjectImage'

interface Project {
    id: string
    hasCourseWatermark: boolean
    title: string
    route: string
    image: string
    description: string
    status: string
}

interface ProjectImageGridProps {
    projects: Project[]
}

const ProjectImageGrid: React.FC<ProjectImageGridProps> = (props) => {
    return (
        <Grid container spacing={2}>
            {props.projects.map((project) => (
                <Grid
                    key={project.id}
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <MemoizedProjectImage
                        hasCourseWatermark={project.hasCourseWatermark}
                        title={project.title}
                        image={project.image}
                        route={project.route}
                        description={project.description}
                        status={project.status}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default ProjectImageGrid
