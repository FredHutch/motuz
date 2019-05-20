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
            />
        );
    }

    componentDidMount() {

    }
}

LeftPane.defaultProps = {
    files: [],
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    files: state.pane.files.left,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);
