import React from "react";
import { Link } from "react-router-dom"
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

import UserMenu from 'components/UserMenu.jsx'

export default class Navbar__ extends React.PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="mr-auto w-25 navbar-nav">
                    <Link to='/'>
                        <span className="navbar-brand">Motuz</span>
                    </Link>
                </div>
                <div className="navbar-collapse navbar-right collapse order-3 dual-collapse2">
                    <div className="navbar-nav ml-auto">
                        <Link to="/clouds" className="nav-link">My Cloud Connections</Link>
                        <UserMenu />
                    </div>
                </div>
            </nav>
        );
    }
}
