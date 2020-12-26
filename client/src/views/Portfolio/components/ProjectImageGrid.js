import React from 'react'
// import { chunk } from 'lodash'

import MemoizedProjectImage from './ProjectImage'
import { Row, Col } from 'react-bootstrap'

const ProjectImageGrid = (props) => {
    // Divide array into chunks of 3 since we want a grid layout with 3 columns
    // const rows = chunk(images, 3)

    return (
        <Row>
            {props.projects.map((project) => (
                <Col
                    key={project.id}
                    xs={12}
                    md={6}
                    lg={4}
                    className="mt-2 mb-2 justify-content-center align-items-center text-center"
                >
                    <MemoizedProjectImage
                        hasCourseWatermark={project.hasCourseWatermark}
                        title={project.title}
                        image={project.image}
                        route={project.route}
                        description={project.description}
                        status={project.status}
                    />
                </Col>
            ))}
        </Row>
    )
}

export default ProjectImageGrid
