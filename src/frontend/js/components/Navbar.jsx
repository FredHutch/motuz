import React from "react";
import { Link } from "react-router-dom"
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

import UserMenu from 'components/UserMenu.jsx'

export default class Navbar__ extends React.PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <div className="navbar-collapse collapse">
                    <div className="mr-auto w-25 navbar-nav">
                        <Link to='/'>
                            <span className="navbar-brand">Motuz</span>
                        </Link>
                        <Link to="/clouds" className="nav-link">Cloud Connections</Link>
                    </div>
                    <div className="w-25 ml-auto">
                        <div className="navbar-collapse collapse order-3 dual-collapse2">
                            <div className="navbar-nav ml-auto">
                                <UserMenu />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}
