import React from 'react'
// import { chunk } from 'lodash'

import ProjectImage from './ProjectImage'
import { Row, Col } from 'react-bootstrap'

const ProjectImageGrid = (props) => {
    const images = props.projects.map((project) => (
        <ProjectImage
            key={project.id}
            hasCourseWatermark={project.hasCourseWatermark}
            title={project.title}
            image={project.image}
            route={project.route}
            description={project.description}
            status={project.status}
        />
    ))

    // Divide array into chunks of 3 since we want a grid layout with 3 columns
    // const rows = chunk(images, 3)

    return (
        <Row>
            {images.map((col, index) => (
                <Col
                    key={index}
                    xs={12}
                    md={6}
                    lg={4}
                    className="mt-2 mb-2 justify-content-center align-items-center text-center"
                >
                    {col}
                </Col>
            ))}
        </Row>
    )
}

export default ProjectImageGrid
