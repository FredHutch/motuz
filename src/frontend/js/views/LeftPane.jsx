import React from 'react';

import Pane from 'views/Pane/Pane.jsx';

class LeftPane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Pane
                files={this.props.files}
                fileFocusIndex={this.props.fileFocusIndex}
                active={this.props.active}
            />
        );
    }

    componentDidMount() {

    }
}

LeftPane.defaultProps = {
    files: [],
    active: false,
    fileFocusIndex: 0,
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    files: state.pane.files.left,
    fileFocusIndex: state.pane.panes.left.fileFocusIndex,
    active: state.pane.focusPaneLeft,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);
