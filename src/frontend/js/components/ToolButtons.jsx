import React from 'react';

import Icon from 'components/Icon.jsx';


class ToolButtons extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <button
                    className="btn btn-outline-primary my-2 mx-1 my-sm-0"
                    onClick={event => this.props.onShowMkdirDialog()}
                    alt='Create Folder'
                    title='Create Folder'
                    aria-label='Create Folder'
                >
                    <Icon name='file-submodule'/>
                </button>

                <button
                    className="btn btn-outline-primary my-2 mx-1 my-sm-0"
                    onClick={event => this.props.onRefresh()}
                    alt='Press to refresh panes'
                    title='Press to refresh panes'
                    aria-label='Press to refresh panes'
                >
                    <Icon
                        name='sync'
                    />
                </button>
            </React.Fragment>
        );
    }
}

ToolButtons.defaultProps = {
    showHiddenFiles: true,
    onShowMkdirDialog: () => {},
    onRefresh: () => {},
}

import {connect} from 'react-redux';
import {refreshPanes} from 'actions/paneActions.jsx';
import {showMkdirDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    showHiddenFiles: state.pane.showHiddenFiles,
});

const mapDispatchToProps = dispatch => ({
    onShowMkdirDialog: () => dispatch(showMkdirDialog()),
    onRefresh: () => dispatch(refreshPanes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolButtons);
