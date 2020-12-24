import React from 'react'
import { chunk } from 'lodash'

import ProjectImage from './ProjectImage'
import { Row, Col } from 'react-bootstrap'

const ProjectImageGrid = (props) => {
    const images = props.projects.map((project) => (
        <ProjectImage
            key={project.id}
            title={project.title}
            route={project.route}
            description={project.description}
            status={project.status}
        />
    ))

    // Divide array into chunks of 3 since we want a grid layout with 3 columns
    const rows = chunk(images, 3)
    return (
        <React.Fragment>
            {rows.map((cols, index) => (
                <Row
                    key={index}
                    className="justify-content-center align-items-center"
                >
                    {cols.map((col, index) => (
                        <Col
                            key={index}
                            xs={12}
                            md={4}
                            className="justify-content-center align-items-center text-center"
                        >
                            {col}
                        </Col>
                    ))}
                </Row>
            ))}
        </React.Fragment>
    )
}

export default ProjectImageGrid
