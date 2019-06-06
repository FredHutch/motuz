import React from 'react';

import CopyJobDialog from 'views/Dialog/CopyJobDialog.jsx';
import NewCloudConnectionDialog from 'views/Dialog/NewCloudConnectionDialog.jsx';
import EditCloudConnectionDialog from 'views/Dialog/EditCloudConnectionDialog.jsx';

class Dialogs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.dialogs.displayCopyJobDialog && <CopyJobDialog />}
                {this.props.dialogs.displayNewCloudConnectionDialog && <NewCloudConnectionDialog />}
                {this.props.dialogs.displayEditCloudConnectionDialog && <EditCloudConnectionDialog />}
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
