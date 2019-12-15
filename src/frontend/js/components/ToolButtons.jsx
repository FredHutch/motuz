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

                <button
                    className="btn btn-outline-primary my-2 mx-1 my-sm-0"
                    onClick={event => this.props.onToggleShowHiddenFiles()}
                    alt='Press to toggle hidden files'
                    title='Press to toggle hidden files'
                    aria-label='Press to toggle hidden files'
                >
                    <Icon
                        name={this.props.showHiddenFiles ? 'eye' : 'eye-closed'}
                    />
                </button>

                <button
                    className="btn btn-outline-primary my-2 mx-1 my-sm-0"
                    onClick={event => this.props.onShowSettingsDialog()}
                    alt='Press to change user settings'
                    title='Press to change user settings'
                    aria-label='Press to change user settings'
                >
                    <Icon
                        name='gear'
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
    onToggleShowHiddenFiles: () => {},
    onShowSettingsDialog: () => {},
}

import {connect} from 'react-redux';
import {toggleShowHiddenFiles, refreshPanes} from 'actions/paneActions.jsx';
import {showMkdirDialog, showSettingsDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    showHiddenFiles: state.pane.showHiddenFiles,
});

const mapDispatchToProps = dispatch => ({
    onShowMkdirDialog: () => dispatch(showMkdirDialog()),
    onRefresh: () => dispatch(refreshPanes()),
    onToggleShowHiddenFiles: () => dispatch(toggleShowHiddenFiles()),
    onShowSettingsDialog: () => dispatch(showSettingsDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolButtons);
