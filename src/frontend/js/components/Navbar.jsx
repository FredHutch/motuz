import React from "react";
import { Link } from "react-router-dom"

import Icon from 'components/Icon.jsx'
import UserMenu from 'components/UserMenu.jsx'

export default class Navbar extends React.PureComponent {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <div className="nav navbar-nav">
                    <Link to='/'>
                        {this.props.brandIsBackArrow && (
                            <React.Fragment>
                                <span className="navbar-brand p-0">
                                    <Icon name='chevron-left' verticalAlign='middle' size="medium"/>
                                </span>
                                <span className="navbar-brand">&nbsp;</span> { /* Fixes height */ }
                            </React.Fragment>
                        )}
                        {!this.props.brandIsBackArrow && (
                            <span className="navbar-brand">Motuz</span>
                        )}
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

Navbar.defaultProps = {
    brandIsBackArrow: false,
}