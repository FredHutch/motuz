import React from "react";
import { Link } from "react-router-dom"
import { NavDropdown } from 'react-bootstrap'

class UserMenu extends React.PureComponent {
    render() {
        return (
            <div className="navbar-nav text-right d-inline-block">
                <NavDropdown title={this.props.username}>
                      <Link to="/logout" className='dropdown-item'>Logout</Link>
                </NavDropdown>
            </div>
        );
    }
}


UserMenu.defaultProps = {
    username: '',
}

import {connect} from 'react-redux';
import { getCurrentUser } from 'reducers/authReducer.jsx';

const mapStateToProps = state => ({
    username: getCurrentUser(state.auth),
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);

