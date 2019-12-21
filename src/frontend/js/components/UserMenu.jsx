import React from 'react'
import { Link } from 'react-router-dom'
import { NavDropdown } from 'react-bootstrap'

import Icon from 'components/Icon.jsx'

class UserMenu extends React.PureComponent {
    render() {
        return (
            <NavDropdown alignRight className='w-200' direction='left' title={this.props.username}>
                <Link to='#' onClick={(e) => this.onSettingsClick(e)} className='dropdown-item'>
                    <Icon name='gear' className='mr-2'/>
                    <span>Settings</span>
                </Link>
                <Link to="/logout" className='dropdown-item'>
                    <Icon name='sign-out' className='mr-2'/>
                    Logout
                </Link>
            </NavDropdown>
        );
    }

    onSettingsClick(e) {
        this.props.onShowSettingsDialog()
    }
}



UserMenu.defaultProps = {
    username: '',
    onShowSettingsDialog: () => {},
}

import {connect} from 'react-redux';
import { getCurrentUser } from 'reducers/authReducer.jsx';
import {showSettingsDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    username: getCurrentUser(state.auth),
});

const mapDispatchToProps = dispatch => ({
    onShowSettingsDialog: () => dispatch(showSettingsDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu);

