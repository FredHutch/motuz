import React from 'react';

class PaneFile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                PaneFile
            </div>
        );
    }

    componentDidMount() {

    }
}

PaneFile.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PaneFile);
