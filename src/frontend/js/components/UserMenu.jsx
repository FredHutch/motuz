import React from "react";
import { Link } from "react-router-dom"
import { NavDropdown } from 'react-bootstrap'

class UserMenu extends React.PureComponent {
    render() {
        return (
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <div className="navbar-nav ml-auto">
                    <NavDropdown direction='left' title={this.props.username}>
                        <Link to="/logout" className='dropdown-item'>Logout</Link>
                    </NavDropdown>
                </div>
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

