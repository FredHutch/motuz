import React from 'react';

import CommandBar from 'views/CommandBar.jsx'

class LeftCommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.active)
        return (
            <CommandBar
                isLeft={true}
                active={this.props.active}
            />
        );
    }

    componentDidMount() {

    }
}

LeftCommandBar.defaultProps = {
    active: false,
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    active: state.pane.focusPaneLeft,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftCommandBar);
