import React from 'react';

import Pane from 'views/App/Pane/Pane.jsx';

class LeftPane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Pane
                files={this.props.files}
                pane={this.props.pane}
                active={this.props.active}
                side='left'
            />
        );
    }

    componentDidMount() {

    }
}

LeftPane.defaultProps = {
    files: [],
    active: false,
    pane: {},
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    files: state.pane.files.left,
    active: state.pane.focusPaneLeft,
    pane: state.pane.panes.left[0],
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);
