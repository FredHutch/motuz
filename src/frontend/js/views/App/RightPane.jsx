import React from 'react';

import Pane from 'views/App/Pane/Pane.jsx';

class RightPane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Pane
                files={this.props.files}
                pane={this.props.pane}
                active={this.props.active}
                side='right'
            />
        );
    }

    componentDidMount() {

    }
}

RightPane.defaultProps = {
    files: [],
    active: false,
    pane: {},
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    files: state.pane.files.right,
    pane: state.pane.panes.right[0],
    active: !state.pane.focusPaneLeft,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);
