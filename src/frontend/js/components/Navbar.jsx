import React from "react";
import { Link } from "react-router-dom"

import UserMenu from 'components/UserMenu.jsx'

export default class Navbar extends React.PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <div className="nav navbar-nav">
                    <Link to='/'>
                        <span className="navbar-brand">Motuz</span>
                    </Link>
                </div>
                <div className="nav navbar-nav ml-auto">
                    <Link to="/clouds" className="nav-link">My Cloud Connections</Link>
                    <UserMenu />
                </div>
            </nav>
        );
    }
}
