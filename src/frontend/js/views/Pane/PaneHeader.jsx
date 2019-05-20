import React from 'react';

class PaneHeader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                PaneHeader
            </div>
        );
    }

    componentDidMount() {

    }
}

PaneHeader.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PaneHeader);
