import React from 'react';

import CommandBar from 'views/App/CommandBar/CommandBar.jsx'

class LeftCommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CommandBar
                isLeft={true}
                active={this.props.active}
                host={this.props.host}
                path={this.props.path}
            />
        );
    }

    componentDidMount() {

    }
}

LeftCommandBar.defaultProps = {
    active: false,
    host: '',
    path: '',
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    active: state.pane.focusPaneLeft,
    host: state.pane.panes.left[0].host,
    path: state.pane.panes.left[0].path,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftCommandBar);
