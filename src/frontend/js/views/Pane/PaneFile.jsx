import React from 'react';

import formatBytes from 'utils/formatBytes.jsx'

class PaneFile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {type, name, size} = this.props;

        return (
            <React.Fragment>
                <div>.</div>
                <div>{name}</div>
                <div>{formatBytes(size)}</div>
            </React.Fragment>
        );
    }

    componentDidMount() {

    }
}

PaneFile.defaultProps = {
    type: 'dir',
    name: '',
    size: 0,
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PaneFile);
