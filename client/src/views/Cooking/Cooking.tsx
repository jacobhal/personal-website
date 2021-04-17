import React from 'react'
import { NavBar } from '../../components/NavBar'
import CookingNavBar from './components/CookingNavBar'

const Cooking = () => {
    return (
        <>
            <NavBar noImage={true} noMarginBottom={true} />
            <CookingNavBar />
        </>
    )
}

export default Cooking
