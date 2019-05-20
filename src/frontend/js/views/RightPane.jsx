import React from 'react';

import Pane from 'views/Pane/Pane.jsx';

class RightPane extends React.Component {
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

RightPane.defaultProps = {
    files: [],
    active: false,
    fileFocusIndex: 0,
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    files: state.pane.files.right,
    fileFocusIndex: state.pane.panes.left.fileFocusIndex,
    active: !state.pane.focusPaneLeft,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);
