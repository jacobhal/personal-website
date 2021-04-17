import React from 'react'
import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

interface IMobileCookingGridItemProps {
    icon: IconDefinition
    linkText: string
    route: string
}

const MobileCookingGridItem = ({
    icon,
    linkText,
    route,
}: IMobileCookingGridItemProps) => {
    return (
        <Col
            xs={12}
            md={6}
            lg={4}
            className="mt-2 mb-2 justify-content-center align-items-center text-center mobile-cooking-grid-item"
        >
            <Link to={`/${route}`} className="mobile-cooking-grid-item-link">
                <p>
                    <FontAwesomeIcon icon={icon} />
                </p>
                {linkText}
            </Link>
        </Col>
    )
}

export default MobileCookingGridItem
