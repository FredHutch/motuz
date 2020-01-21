import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import PrivateRoute from 'components/PrivateRoute.jsx';
import Dialogs from 'views/Dialogs/Dialogs.jsx';
import PageNotFound from 'views/PageNotFound.jsx'
import Login from 'views/Login.jsx'
import Logout from 'views/Logout.jsx'
import Clouds from 'views/Clouds/Clouds.jsx'
import App from 'views/App/App.jsx'
import Alerts from 'views/Alerts/Alerts.jsx'

import 'style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toggle/style.css'

import 'favicon.ico';

class Root extends React.PureComponent {
    render() {
        const { isAuthenticated } = this.props;
        return (
            <Router>
                <Switch>
                    <PrivateRoute exact path="/" component={App} display={isAuthenticated} redirect='/login' />
                    <PrivateRoute exact path="/clouds" component={Clouds} display={isAuthenticated} redirect='/login' />
                    <PrivateRoute exact path="/login" component={Login} display={!isAuthenticated} redirect='/' />
                    <PrivateRoute exact path="/logout" component={Logout} display={isAuthenticated} redirect='/' />
                    <Route component={PageNotFound}/>
                </Switch>
                <Dialogs />
                <Alerts />
            </Router>
        );
    }
}

Root.defaultProps = {
    isAuthenticated: false,
}

import {connect} from 'react-redux';
import { isAuthenticated } from 'reducers/authReducer.jsx';

const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state.auth),
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
