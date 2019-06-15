import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import PrivateRoute from 'components/PrivateRoute.jsx';
import Dialogs from 'views/Dialog/Dialogs.jsx';
import PageNotFound from 'views/PageNotFound.jsx'
import Login from 'views/Login.jsx'
import Clouds from 'views/Clouds/Clouds.jsx'
import App from 'views/App/App.jsx'

// import 'bootstrap/dist/js/bootstrap.min.js';

import 'style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

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
                    <Route component={PageNotFound}/>
                </Switch>
                <Dialogs />
            </Router>
        );
    }
}

Root.defaultProps = {
    isAuthenticated: false,
}

import {connect} from 'react-redux';
import * as reducers from 'reducers/reducers.jsx';

const mapStateToProps = state => ({
    isAuthenticated: reducers.isAuthenticated(state),
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
