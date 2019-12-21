import React from 'react';

import NewCopyJobDialog from 'views/Dialogs/NewCopyJobDialog.jsx';
import EditCopyJobDialog from 'views/Dialogs/EditCopyJobDialog.jsx';
import NewCloudConnectionDialog from 'views/Dialogs/CloudConnection/NewCloudConnectionDialog.jsx';
import EditCloudConnectionDialog from 'views/Dialogs/CloudConnection/EditCloudConnectionDialog.jsx';
import MkdirDialog from 'views/Dialogs/MkdirDialog.jsx';
import SettingsDialog from 'views/Dialogs/SettingsDialog.jsx';

class Dialogs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.dialogs.displayNewCopyJobDialog && <NewCopyJobDialog />}
                {this.props.dialogs.displayEditCopyJobDialog && <EditCopyJobDialog />}
                {this.props.dialogs.displayNewCloudConnectionDialog && <NewCloudConnectionDialog />}
                {this.props.dialogs.displayEditCloudConnectionDialog && <EditCloudConnectionDialog />}
                {this.props.dialogs.displayMkdirDialog && <MkdirDialog />}
                {this.props.dialogs.displaySettingsDialog && <SettingsDialog />}
            </React.Fragment>
        );
    }

    componentDidMount() {

    }
}

Dialogs.defaultProps = {
    dialogs: {},
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    dialogs: state.dialog,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);
