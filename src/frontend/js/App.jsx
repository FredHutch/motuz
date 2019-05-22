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
                <div id="zone-left-pane" className='zone-pane'>
                    <LeftPane />
                </div>
                <div id="zone-right-pane" className='zone-pane'>
                    <RightPane />
                </div>
                <JobProgress id="zone-job-progress"/>
                <div id="zone-status-bar">
                    <StatusBar />
                </div>
            </div>
        );
    }

    componentDidMount() {
        // const _fetch = window.fetch
        // window.fetch = (a, b, c, d) => {
        //     console.log('called fetch', arguments)
        //     const ret = _fetch(a, b, c, d);
        //     console.log('ret', ret)
        //     return ret;
        // }
        this.props.onMount();
    }
}

App.defaultProps = {
    onMount: () => {},
}

import {connect} from 'react-redux';
import {directoryChange} from 'actions/paneActions.jsx'
import {listFiles} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onMount: () => {
        dispatch(listFiles('left', '/'));
        // dispatch(directoryChange('left', '/foo'));
        // dispatch(directoryChange('right', '/'));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
