import React from 'react'

import { ResponsiveEmbed, Image } from 'react-bootstrap'

import udemyImage from './../../../assets/images/udemy.jpg'

const ProjectImage = ({ title, image, route, hasCourseWatermark }) => {
    return (
        <div className="project-image-container justify-content-center align-items-center text-center">
            <div className="project-image-hover-content justify-content-center text-center">
                <h4 className="project-image-title text-center">{title}</h4>
                <a href={route} className="project-image-button btn btn-light">
                    View
                </a>
            </div>
            <ResponsiveEmbed aspectRatio="16by9">
                <Image src={image} className="project-image" />
            </ResponsiveEmbed>
            {hasCourseWatermark ? (
                <ResponsiveEmbed
                    style={{ width: 100, height: 'auto' }}
                    aspectRatio="16by9"
                    className="image-icon"
                >
                    <Image src={udemyImage} />
                </ResponsiveEmbed>
            ) : null}
        </div>
    )
}

// React memo with custom equality checker in order to know when we want to re-render
// This is unnecessary in this case but very useful if a small component is being forced to re-render by a parent component
const MemoizedProjectImage = React.memo(
    ProjectImage,
    (prevProject, nextProject) =>
        prevProject.title === nextProject.title &&
        prevProject.route === nextProject.route
)

export default MemoizedProjectImage
