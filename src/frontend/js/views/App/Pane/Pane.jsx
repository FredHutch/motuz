import React from 'react';
import upath from 'upath';

import PaneFile from 'views/App/Pane/PaneFile.jsx'

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
                useSiUnits={this.props.useSiUnits}
                active={this.props.active && this.props.pane.fileMultiFocusIndexes[i]}
                onMouseDown={(event) => this.onFileClick(event, this.props.side, i)}
                onDoubleClick={() => this.onFileDoubleClick(this.props.side, i)}
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

    onFileClick(event, side, index) {
        const isRangeSelection = event.shiftKey
        const isMultiSelection = event.metaKey || event.ctrlKey

        if (isMultiSelection) {
            this.props.onMultiSelect(side, index)
        } else if (isRangeSelection) {
            this.props.onRangeSelect(side, index)
        } else {
            this.props.onSelect(side, index)
        }
    }

    onFileDoubleClick(side, index) {
        const currPath = this.props.pane.path;
        const directoryToEnter = this.props.files[index]
        if (directoryToEnter.type !== 'dir') {
            return; // We do not open files
        }

        const path = upath.join(currPath, directoryToEnter.name)
        this.props.onDirectoryChange(side, path)
    }
}

Pane.defaultProps = {
    side: 'left',
    files: [],
    pane: {},
    active: false,
    useSiUnits: false,
    onSelect: (side, index) => {},
    onMultiSelect: (side, index) => {},
    onRangeSelect: (side, index) => {},
}

import {connect} from 'react-redux';
import {
    fileFocusIndex,
    fileMultiFocusIndexes,
    fileRangeFocusIndex,
    directoryChange,
} from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
    useSiUnits: state.settings.useSiUnits,
});

const mapDispatchToProps = dispatch => ({
    onSelect: (side, index) => dispatch(fileFocusIndex(side, index)),
    onMultiSelect: (side, index) => dispatch(fileMultiFocusIndexes(side, index)),
    onRangeSelect: (side, index) => dispatch(fileRangeFocusIndex(side, index)),
    onDirectoryChange: (side, path) => dispatch(directoryChange(side, path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Pane);
