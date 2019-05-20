import React from 'react';

import CommandBar from 'views/CommandBar.jsx'

class RightCommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CommandBar
                isLeft={false}
                active={this.props.active}
            />
        );
    }

    componentDidMount() {

    }
}

RightCommandBar.defaultProps = {
    active: false,
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    active: !state.pane.focusPaneLeft,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RightCommandBar);
