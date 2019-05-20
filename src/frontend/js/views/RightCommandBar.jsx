import React from 'react';

import CommandBar from 'views/CommandBar.jsx'

class RightCommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CommandBar></CommandBar>
        );
    }

    componentDidMount() {

    }
}

RightCommandBar.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RightCommandBar);
