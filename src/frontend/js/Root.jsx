import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Navbar from 'components/Navbar.jsx'
import PageNotFound from 'views/PageNotFound.jsx'
import App from 'App.jsx'

import 'bootstrap/dist/js/bootstrap.min.js';

import 'style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import 'favicon.ico';

export default class Root extends React.Component {
    render() {
        return <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={App}/>
                    <Route component={PageNotFound}/>
                </Switch>
            </div>
        </Router>
    }
}
