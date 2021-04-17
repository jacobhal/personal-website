import React from 'react'
import { NavBar } from '../../components/NavBar'
import CookingNavBar from './components/SideNavBar/CookingNavBar'

const Cooking = () => {
    return (
        <>
            <NavBar noImage={true} noMarginBottom={true} />
            <CookingNavBar menuItem="none" />
        </>
    )
}

export default Cooking
