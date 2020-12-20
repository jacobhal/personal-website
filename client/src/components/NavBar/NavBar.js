import React from 'react';
import logo from '../../assets/images/favicon-256.png';

import { Navbar, Nav } from 'react-bootstrap';

import './NavBar.css';


const NavBar = () => {
  const styling = {height: '28px', width: '28px'};
  return (
    <Navbar expand="lg">
      <Navbar.Brand href="/"> 
                <img
                  src={logo}
                  alt="Jacob Hallman"
                  style={styling}
                />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"> 
        <i className="fa fa-bars"></i> 
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
  );


}

export default NavBar;
