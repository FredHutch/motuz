import React from "react";
import { Link } from "react-router-dom"

import NavbarItem from 'components/NavbarItem.jsx'

export default class Navbar extends React.Component {
    render() {
        return <nav className="navbar navbar-inverse navbar-static-top">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link className="navbar-brand" to="/">Motuz</Link>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                        <NavbarItem link="/app" title="App"></NavbarItem>
                    </ul>
                </div>
            </div>
        </nav>
    }
}
