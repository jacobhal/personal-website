import React from 'react'
import { Row, Container } from 'react-bootstrap'
import MobileCookingGridItem from './MobileCookingGridItem'
import {
    faUtensils,
    faGlassMartiniAlt,
    faIceCream,
    faBreadSlice,
    faHamburger,
    faSeedling,
    faInfo,
    faPepperHot,
    faUtensilSpoon,
    faFillDrip,
    faCheck,
    faBirthdayCake,
} from '@fortawesome/free-solid-svg-icons'

const MobileCookingGrid = ({ ...rest }) => {
    return (
        <Container
            className="pb-3 justify-content-center align-items-center text-center"
            {...rest}
        >
            <Row>
                <MobileCookingGridItem
                    linkText="Förrätter"
                    route="starters"
                    icon={faBreadSlice}
                />
                <MobileCookingGridItem
                    linkText="Varmrätter"
                    route="main-courses"
                    icon={faHamburger}
                />
                <MobileCookingGridItem
                    linkText="Desserter"
                    route="desserts"
                    icon={faIceCream}
                />
                <MobileCookingGridItem
                    linkText="Bakverk"
                    route="pastries"
                    icon={faBirthdayCake}
                />
                <MobileCookingGridItem
                    linkText="Sallader"
                    route="salads"
                    icon={faSeedling}
                />
                <MobileCookingGridItem
                    linkText="Såser"
                    route="sauces"
                    icon={faUtensilSpoon}
                />
                <MobileCookingGridItem
                    linkText="Marinader"
                    route="marinades"
                    icon={faFillDrip}
                />
                <MobileCookingGridItem
                    linkText="Basrecept"
                    route="base-recipes"
                    icon={faCheck}
                />
                <MobileCookingGridItem
                    linkText="Drinkar"
                    route="drinks"
                    icon={faGlassMartiniAlt}
                />
                <MobileCookingGridItem
                    linkText="Redskap"
                    route="tools"
                    icon={faUtensils}
                />
                <MobileCookingGridItem
                    linkText="Kocktips"
                    route="cooking-tips"
                    icon={faInfo}
                />
                <MobileCookingGridItem
                    linkText="Smaker"
                    route="flavors"
                    icon={faPepperHot}
                />
            </Row>
        </Container>
    )
}

export default MobileCookingGrid
