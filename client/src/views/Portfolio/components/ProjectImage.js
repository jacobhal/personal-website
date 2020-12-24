import React from 'react'
import $ from 'jquery'

import { ResponsiveEmbed, Image } from 'react-bootstrap'

import udemyImage from './../../../assets/images/udemy.jpg'

$('.project-image-button').on('mouseover', () => {
    $('.project-image-content').css('opacity', 0)
})

const ProjectImage = ({ title, image, route, hasCourseWatermark }) => {
    return (
        <div className="project-image-container justify-content-center align-items-center text-center">
            <div className="project-image-hover-content justify-content-center text-center">
                <h4 className="project-image-title text-center">{title}</h4>
                <a href={route} className="project-image-button btn btn-light">
                    Visit
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

export default ProjectImage
