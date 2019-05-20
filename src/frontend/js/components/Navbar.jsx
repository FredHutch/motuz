import React from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, NavDropdown, Form } from 'react-bootstrap'


export default class _Navbar extends React.Component {
    render() {
        return (
            <Navbar bg="light" expand="sm">
                <Navbar.Brand>Motuz</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link>Operations</Nav.Link>
                        <Nav.Link disabled={true}>Copy Jobs</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
