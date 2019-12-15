import React from 'react';

import Navbar from 'components/Navbar.jsx'
import LeftCommandBar from 'views/App/CommandBar/LeftCommandBar.jsx';
import RightCommandBar from 'views/App/CommandBar/RightCommandBar.jsx';
import LeftPane from 'views/App/Pane/LeftPane.jsx';
import RightPane from 'views/App/Pane/RightPane.jsx';
import CopyJobSection from 'views/App/CopyJobSection/CopyJobSection.jsx';
import StatusBar from 'views/App/StatusBar.jsx';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Navbar />
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
                    <CopyJobSection id="zone-job-progress"/>
                    <div id="zone-status-bar">
                        <StatusBar />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.props.onMount();
    }
}

App.defaultProps = {
    onMount: () => {},
}

import {connect} from 'react-redux';
import {initPanes} from 'actions/paneActions.jsx'
import {listCloudConnections} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onMount: () => {
        dispatch(initPanes()),
        dispatch(listCloudConnections());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
