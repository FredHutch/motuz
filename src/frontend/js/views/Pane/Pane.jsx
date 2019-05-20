import React from 'react';

import PaneFile from 'views/Pane/PaneFile.jsx'
import PaneHeader from 'views/Pane/PaneHeader.jsx'

class Pane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const paneFiles = this.props.files.map((file, i) => (
            <PaneFile
                key={i}
                type={file.type}
                name={file.name}
                size={file.size}
                active={this.props.active && i === this.props.fileFocusIndex}
                onClick={() => console.log(i)}
            />
        ))

        return (
            <div className='grid-files'>
                {paneFiles}
            </div>
        );
    }

    componentDidMount() {

    }
}

Pane.defaultProps = {
    files: [],
    fileFocusIndex: 0,
    active: false,
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Pane);
