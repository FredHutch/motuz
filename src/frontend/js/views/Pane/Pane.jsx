import React from 'react';

import PaneFile from 'views/Pane/PaneFile.jsx'
import PaneHeader from 'views/Pane/PaneHeader.jsx'

class Pane extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.files)



        const paneFiles = this.props.files.map((file, i) => (
            <PaneFile
                key={i}
                type={file.type}
                name={file.name}
                size={file.size}
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
    files: []
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Pane);
