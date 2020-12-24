import React from 'react'
import { chunk } from 'lodash'

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
    const rows = chunk(images, 3)

    return (
        <React.Fragment>
            {rows.map((cols, index) => (
                <div
                    className="image-grid justify-content-center align-items-center text-center"
                    key={index}
                >
                    <Row
                        key={index}
                        className="image-grid-row justify-content-center align-items-center text-center"
                    >
                        {cols.map((col, index) => (
                            <Col
                                key={index}
                                xs={12}
                                md={4}
                                className="image-grid-col justify-content-center align-items-center text-center"
                            >
                                {col}
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </React.Fragment>
    )
}

export default ProjectImageGrid
