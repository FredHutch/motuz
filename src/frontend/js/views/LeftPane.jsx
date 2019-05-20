import React from 'react';

import Pane from 'views/Pane/Pane.jsx';

class LeftPane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Pane></Pane>
        );
    }

    componentDidMount() {

    }
}

LeftPane.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);
