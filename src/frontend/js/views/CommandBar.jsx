import React from 'react';

class CommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                CommandBar
            </div>
        );
    }

    componentDidMount() {

    }
}

CommandBar.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
