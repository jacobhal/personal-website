import React, { useState } from 'react'
import logo from '../../assets/images/favicon-256.png'
import $ from 'jquery'

import { Navbar, Nav } from 'react-bootstrap'

import './NavBar.css'

const NavBar = () => {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false)

    const handleNavIconToggle = (e) => {
        setIsBurgerOpen(!isBurgerOpen)
    }

    const styling = { height: '28px', width: '28px' }
    return (
        <Navbar expand="lg">
            <Navbar.Brand href="/">
                <img src={logo} alt="Jacob Hallman" style={styling} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
                <div
                    id="nav-icon"
                    onClick={handleNavIconToggle}
                    className={isBurgerOpen ? 'open' : null}
                >
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </div>
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto" pullRight>
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
