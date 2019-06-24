import React from "react";
import { Link } from "react-router-dom"

import ToolButtons from 'components/ToolButtons.jsx'
import UserMenu from 'components/UserMenu.jsx'

export default class Navbar extends React.PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <Link to='/'>
                    <span className="navbar-brand">Motuz</span>
                </Link>
                <button aria-controls="basic-navbar-nav" type="button" aria-label="Toggle navigation" className="navbar-toggler">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse" id="basic-navbar-nav">
                    <div className="mr-auto navbar-nav">
                        <Link to="/clouds" className="nav-link">Cloud Connections</Link>
                    </div>
                </div>
                {window.location.pathname === '/' && <ToolButtons/>}
                <UserMenu />
            </nav>
        );
    }
}
