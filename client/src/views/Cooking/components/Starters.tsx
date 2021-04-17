import React from 'react'
import { NavBar } from './../../../components/NavBar'
import CookingNavBar from './SideNavBar/CookingNavBar'

const Starters = () => {
    return (
        <>
            <NavBar noImage={true} noMarginBottom={true} />
            <CookingNavBar menuItem="starters" />
        </>
    )
}

export default Starters
