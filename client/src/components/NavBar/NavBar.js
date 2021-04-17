import React, { useState } from 'react'
import logo from '../../assets/images/favicon-256.png'

import { Navbar, Nav } from 'react-bootstrap'

import './NavBar.scss'

interface INavBarProps {
    noImage: boolean;
    noMarginBottom: boolean;
}

const NavBar = ({ noImage, noMarginBottom }: INavbarProps) => {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false)

    const handleNavIconToggle = (e) => {
        setIsBurgerOpen(!isBurgerOpen)
    }

    const styling = { height: '28px', width: '28px' }
    const noImageClass = noImage ? 'no-background' : ''
    const noMarginBottomClass = noMarginBottom ? 'no-margin-bottom' : ''

    return (
        <Navbar
            expand="lg"
            className={`${noImageClass} ${noMarginBottomClass}`}
        >
            <Navbar.Brand href="/">
                <img src={logo} alt="Jacob Hallman" style={styling} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
                <div
                    id="nav-icon"
                    onClick={handleNavIconToggle}
                    className={isBurgerOpen ? 'open' : null}
                >
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </div>
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/resume">Resume</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/portfolio">Portfolio</Nav.Link>
                    <Nav.Link href="/contact">Contact</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar
