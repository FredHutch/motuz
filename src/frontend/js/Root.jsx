import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Dialogs from 'views/Dialog/Dialogs.jsx';
import PageNotFound from 'views/PageNotFound.jsx'
import Login from 'views/Login.jsx'
import Clouds from 'views/Clouds/Clouds.jsx'
import App from 'views/App/App.jsx'

// import 'bootstrap/dist/js/bootstrap.min.js';

import 'style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import 'favicon.ico';

export default class Root extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={App}/>
                    <Route exact path="/clouds" component={Clouds}/>
                    <Route exact path="/login" component={Login}/>
                    <Route component={PageNotFound}/>
                </Switch>
                <Dialogs />
            </Router>
        );
    }
}
