import React from 'react';

import PaneFile from 'views/Pane/PaneFile.jsx'
import PaneItem from 'views/Pane/PaneItem.jsx'

class Pane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // console.log(this.props.files)

        return (
            <div>
                Pane
            </div>
        );
    }

    componentDidMount() {

    }
}

Pane.defaultProps = {
    files: []
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Pane);
