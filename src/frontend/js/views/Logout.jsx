import React from 'react';
import classnames from 'classnames';

import 'logo.png';


class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div></div>
        );
    }

    componentDidMount() {
        this.props.onLogout();
    }
}

Logout.defaultProps = {
    onLogout: () => {},
}

import {connect} from 'react-redux';
import {logout} from 'actions/authActions.jsx'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onLogout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
