import React from "react";
import { Link } from "react-router-dom"

class UserMenu extends React.PureComponent {
    render() {
        return (
            <div className="ml-auto navbar-nav">
                <Link to="/logout" className="nav-link">Logout</Link>
                <Link to="#" className="nav-link">{this.props.username}</Link>
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

