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
                    className="btn btn-outline-primary my-2 my-sm-0"
                    onClick={event => this.props.onToggleShowHiddenFiles()}
                >
                    <Icon
                        name={this.props.showHiddenFiles ? 'eye-closed' : 'eye'}
                    />
                </button>
            </React.Fragment>
        );
    }

    componentDidMount() {

    }

    onToggleShowHiddenFiles() {
        this.props.onToggleShowHiddenFiles();
    }
}

ToolButtons.defaultProps = {
    showHiddenFiles: true,
    onToggleShowHiddenFiles: () => {},
}

import {connect} from 'react-redux';
import {toggleShowHiddenFiles} from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
    showHiddenFiles: state.pane.showHiddenFiles,
});

const mapDispatchToProps = dispatch => ({
    onToggleShowHiddenFiles: () => dispatch(toggleShowHiddenFiles()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToolButtons);
