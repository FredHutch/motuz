import React from "react";
import { Link } from "react-router-dom"


export default class Navbar extends React.Component {
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
                        <Link to="/" className="nav-link">Operations</Link>
                        <Link to="/clouds" className="nav-link disabled">Cloud Connections</Link>
                        <Link to="/copy-jobs" className="nav-link disabled">Copy Jobs</Link>
                    </div>
                </div>
            </nav>
        );
    }
}
