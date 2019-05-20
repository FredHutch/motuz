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
                fileFocusIndex={1}
                active={false}

            />
        );
    }

    componentDidMount() {

    }
}

RightPane.defaultProps = {
    files: [],
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    files: state.pane.files.right,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);
