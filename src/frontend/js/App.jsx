import React from 'react';

import LeftCommandBar from 'views/LeftCommandBar.jsx';
import RightCommandBar from 'views/RightCommandBar.jsx';
import LeftPane from 'views/LeftPane.jsx';
import RightPane from 'views/RightPane.jsx';
import JobProgress from 'views/JobProgress.jsx';
import StatusBar from 'views/StatusBar.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="grid-container">
                <div id="zone-left-commands" className='zone-command-bar'>
                    <LeftCommandBar />
                </div>
                <div id="zone-right-commands" className='zone-command-bar'>
                    <RightCommandBar />
                </div>
                <div id="zone-left-pane">
                    <LeftPane />
                </div>
                <div id="zone-right-pane">
                    <RightPane />
                </div>
                <div id="zone-job-progress">
                    <JobProgress />
                </div>
                <div id="zone-status-bar">
                    <StatusBar />
                </div>
            </div>
        );
    }

    componentDidMount() {

    }
}

App.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
