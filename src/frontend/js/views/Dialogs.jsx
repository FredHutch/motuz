import React from 'react';

import CopyJobDialog from 'views/Dialog/CopyJobDialog.jsx';

class Dialogs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <CopyJobDialog
                />
            </React.Fragment>
        );
    }

    componentDidMount() {

    }
}

Dialogs.defaultProps = {
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);
