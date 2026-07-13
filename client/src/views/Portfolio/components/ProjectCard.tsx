import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { PortfolioProject } from '../portfolioData'

interface ProjectCardProps {
    project: PortfolioProject
    index: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
    const cardStyle = {
        '--card-image': `url("${project.image}")`,
        '--card-accent': project.accent,
    } as React.CSSProperties

    const cardContent = (
        <Box className="project-card" style={cardStyle}>
            <Box className="project-card-art" aria-hidden="true" />
            <Box className="project-card-wash" aria-hidden="true" />
            <Box className="project-card-topline">
                <Typography component="span" className="project-card-index">
                    {String(index + 1).padStart(2, '0')}
                </Typography>
                <Typography component="span" className="project-card-status">
                    {project.status}
                </Typography>
            </Box>
            <Box className="project-card-content">
                <Typography component="p" className="project-card-kind">
                    {project.kind}
                </Typography>
                <Typography component="h2" className="project-card-title">
                    {project.title}
                </Typography>
                <Typography component="p" className="project-card-description">
                    {project.description}
                </Typography>
                <Box className="project-card-action">
                    <span>{project.actionLabel ?? 'View project'}</span>
                    <span aria-hidden="true" className="project-card-arrow">
                        ↗
                    </span>
                </Box>
            </Box>
        </Box>
    )

    if (project.external) {
        return (
            <Box
                component="a"
                href={project.route}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card-link"
                aria-label={`${project.actionLabel ?? 'View'}: ${project.title}`}
            >
                {cardContent}
            </Box>
        )
    }

    return (
        <Box
            component={RouterLink}
            to={project.route}
            className="project-card-link"
            aria-label={`${project.actionLabel ?? 'View'}: ${project.title}`}
        >
            {cardContent}
        </Box>
    )
}

export default ProjectCard
