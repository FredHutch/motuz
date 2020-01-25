import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'

import serializeForm from 'utils/serializeForm.jsx'
import ToggleInfo from 'components/ToggleInfo.jsx'


class SettingsDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='dialog-copy-job'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#" onSubmit={(event) => this.handleSubmit(event)}>
                        <Modal.Header closeButton>
                            <Modal.Title>User Settings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">

                                <h5 className="text-primary mb-2">Files</h5>

                                <div className="row form-group">
                                    <div className="col-6 text-right">
                                        <b>Show Hidden Files</b>
                                        <ToggleInfo
                                            className='ml-2'
                                            on="Show UNIX hidden files and directories. Hidden files are prefixed with dot (eg. .bashrc)"
                                            off="Hide UNIX hidden files and directories. This is the default option on most systems."
                                        />
                                    </div>
                                    <div className="col-6 text-left">
                                        <Toggle
                                            name='showHiddenFiles'
                                            defaultChecked={this.props.data.showHiddenFiles}
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-6 text-right">
                                        <b>Use SI units for File Sizes</b>
                                        <ToggleInfo
                                            className='ml-2'
                                            on="File sizes will use SI system (KB, MB, GB, TB). 1 KB = 1000 B. This is the default on macOS Finder."
                                            off="File sizes will use the byte system (KiB, MiB, GiB, TiB). 1 KiB = 1024 B. This is the default on Windows Explorer."
                                        />
                                    </div>
                                    <div className="col-6 text-left">
                                        <Toggle
                                            name='useSiUnits'
                                            defaultChecked={this.props.data.useSiUnits}
                                        />
                                    </div>
                                </div>

                                <h5 className="text-primary mb-2">Transfers</h5>

                                <div className="row form-group">
                                    <div className="col-6 text-right">
                                        <b>Follow Symlinks</b>
                                        <ToggleInfo
                                            className='ml-2'
                                            on="When copying files, symlinks to directories will be resolved and followed, as if they were regular directories."
                                            off="When copying files, symlinks to directories will be ignored."
                                        />
                                    </div>
                                    <div className="col-6 text-left">
                                        <Toggle
                                            name='followSymlinks'
                                            defaultChecked={this.props.data.followSymlinks}
                                        />
                                    </div>
                                </div>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit' disabled={this.props.loading}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(event) {
        event.preventDefault();

        const data = serializeForm(event.target)

        this.props.onSubmit(data)
        this.props.onClose()
    }

}

SettingsDialog.defaultProps = {
    data: {
        showHiddenFiles: false,
        useSiUnits: false,
        followSymlinks: false,
    },
    onClose: () => {},
    onSubmit: (data) => {},
}

import {connect} from 'react-redux';
import {hideSettingsDialog} from 'actions/dialogActions.jsx'
import {updateSettings} from 'actions/settingsActions.jsx'

const mapStateToProps = state => ({
    data: state.settings,
    loading: false,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideSettingsDialog()),
    onSubmit: data => dispatch(updateSettings(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
