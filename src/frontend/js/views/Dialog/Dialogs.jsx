import React from 'react';

import CopyJobDialog from 'views/Dialog/CopyJobDialog.jsx';
import CloudConnectionDialog from 'views/Dialog/CloudConnectionDialog.jsx';

class Dialogs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                {this.props.dialogs.displayCopyJobDialog && <CopyJobDialog />}
                {this.props.dialogs.displayCloudConnectionDialog && <CloudConnectionDialog />}
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
