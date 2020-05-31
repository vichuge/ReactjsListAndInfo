import React from 'react'
//Se debe instalar react-bootstrap antes de usarse
import { /*Button,*/ Navbar, /*Nav, NavDropdown,*/ /*Form, FormControl*/ } from 'react-bootstrap'

//https://react-bootstrap.github.io/components/navbar/
const NavBar = () => (
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/">
      <img
        alt=""
        src="../../images/logo.svg"
        width="30"
        height="30"
        className="d-inline-block align-top"
      />{' '}
      Rick y Morty API
    </Navbar.Brand>
  </Navbar>

)

export default NavBar