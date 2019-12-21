import React from "react";
import { Link } from "react-router-dom"

import UserMenu from 'components/UserMenu.jsx'

export default class Navbar extends React.PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <button aria-controls="basic-navbar-nav" type="button" aria-label="Toggle navigation" className="navbar-toggler">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse">
                    <div className="mr-auto w-25 navbar-nav">
                        <Link to='/'>
                            <span className="navbar-brand">Motuz</span>
                        </Link>
                        <Link to="/clouds" className="nav-link">Cloud Connections</Link>
                    </div>
                    <div className="w-25 ml-auto">
                        <UserMenu />
                    </div>
                </div>
            </nav>
        );
    }
}
