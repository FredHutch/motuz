import React from 'react';

class PaneItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                PaneItem
            </div>
        );
    }

    componentDidMount() {

    }
}

PaneItem.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PaneItem);
