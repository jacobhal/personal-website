import React from 'react'
import { NavBar } from '../../components/NavBar'
import CookingNavBar from './components/SideNavBar/CookingNavBar'

const Starters = () => {
    return (
        <>
            <NavBar noImage={true} noMarginBottom={true} />
            <CookingNavBar menuItem="starters" />
            Content
        </>
    )
}

export default Starters
