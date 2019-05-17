import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import Navbar from 'components/Navbar.jsx'
import PageNotFound from 'views/PageNotFound.jsx'
import TemplateComponent from 'TemplateComponent.jsx'

import 'bootstrap/dist/js/bootstrap.min.js';

import 'style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import 'favicon.ico';

export default class Root extends React.Component {
    render() {
        return <Router>
            <div>
                <Route path="/" component={Navbar}/>
                <Switch>
                    <Redirect exact path="/" to='/app' />
                    <Route exact path="/app" component={TemplateComponent}/>
                    <Route component={PageNotFound}/>
                </Switch>
            </div>
        </Router>
    }
}
