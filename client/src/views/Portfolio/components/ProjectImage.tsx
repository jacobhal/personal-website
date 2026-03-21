import React from 'react'
import { Box, Button } from '@mui/material'

import udemyImage from './../../../assets/images/udemy.jpg'

interface ProjectImageProps {
    title: string
    image: string
    route: string
    hasCourseWatermark: boolean
    description?: string
    status?: string
}

const ProjectImage: React.FC<ProjectImageProps> = ({
    title,
    image,
    route,
    hasCourseWatermark,
}) => {
    return (
        <Box
            className="project-image-container"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                width: '100%',
            }}
        >
            <div className="project-image-hover-content justify-content-center text-center">
                <h4 className="project-image-title text-center">{title}</h4>
                <Button
                    variant="outlined"
                    color="inherit"
                    href={route}
                    className="project-image-button"
                >
                    View
                </Button>
            </div>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%',
                    overflow: 'hidden',
                }}
            >
                <Box
                    component="img"
                    src={image}
                    className="project-image"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </Box>
            {hasCourseWatermark ? (
                <Box
                    component="img"
                    src={udemyImage}
                    className="image-icon"
                    sx={{
                        width: 100,
                        height: 'auto',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                    }}
                />
            ) : null}
        </Box>
    )
}

const MemoizedProjectImage = React.memo(
    ProjectImage,
    (prevProject, nextProject) =>
        prevProject.title === nextProject.title &&
        prevProject.route === nextProject.route
)

export default MemoizedProjectImage
