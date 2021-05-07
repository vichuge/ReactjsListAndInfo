import React from 'react'
//Se debe instalar react-bootstrap antes de usarse
import { /*Button,*/ Navbar, /*Nav, NavDropdown,*/ /*Form, FormControl*/ } from 'react-bootstrap'
import imgNavBar from '../images/logo.svg';

//https://react-bootstrap.github.io/components/navbar/
const NavBar = () => (
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="https://vichuge.github.io/ReactjsListAndInfo/">
      <img
        alt=""
        src={imgNavBar}
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      Rick y Morty API
    </Navbar.Brand>
  </Navbar>

)

export default NavBar