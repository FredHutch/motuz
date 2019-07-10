import React from 'react';

import CommandBar from 'views/App/CommandBar/CommandBar.jsx'

class RightCommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CommandBar
                isLeft={false}
                active={this.props.active}
                host={this.props.host}
                path={this.props.path}
            />
        );
    }

    componentDidMount() {

    }
}

RightCommandBar.defaultProps = {
    active: false,
    host: '',
    path: '',
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    active: !state.pane.focusPaneLeft,
    host: state.pane.panes.right[0].host,
    path: state.pane.panes.right[0].path,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RightCommandBar);
