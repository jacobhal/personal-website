import React from 'react';
import logo from '../../assets/images/favicon-256.png';

import { Navbar } from 'react-bulma-components/full';

import './NavBar.css';

document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }
});


const NavBar = () => {
  const styling = {height: '28px', width: '28px'};
  return (
  <Navbar className="is-transparent">
    <Navbar.Brand>
      <Navbar.Item renderAs="a" href="/">
          <img
            src={logo}
            alt="Jacob Hallman"
            style={styling}
          />
        </Navbar.Item>
      <Navbar.Burger role="button" data-target="navMenu" aria-label="menu" aria-expanded="false" />
    </Navbar.Brand>
    <Navbar.Menu id="navMenu">
      <div className="navbar-end is-right" id="navbar-menu-options">
        <Navbar.Container>
          <Navbar.Item className="has-text-centered is-right" href="/">Home</Navbar.Item>
        </Navbar.Container>
        <Navbar.Container position="end">
          <Navbar.Item className="has-text-centered" href="/resume">Resume</Navbar.Item>
        </Navbar.Container>
        <Navbar.Container position="end">
          <Navbar.Item className="has-text-centered" href="/about">About</Navbar.Item>
        </Navbar.Container>
        <Navbar.Container position="end">
          <Navbar.Item className="has-text-centered" href="/portfolio">Portfolio</Navbar.Item>
        </Navbar.Container>
        <Navbar.Container position="end">
          <Navbar.Item className="has-text-centered" href="/contact">Contact</Navbar.Item>
        </Navbar.Container>
      </div>
    </Navbar.Menu>
  </Navbar>);
}

export default NavBar;
