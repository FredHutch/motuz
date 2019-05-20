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
                onMouseDown={() => this.props.onSelect(this.props.side, i)}
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
    side: 'left',
    files: [],
    fileFocusIndex: 0,
    active: false,
    onSelect: (side, index) => {},
}

import {connect} from 'react-redux';
import {fileFocusIndex} from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onSelect: (side, index) => dispatch(fileFocusIndex(side, index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pane);
