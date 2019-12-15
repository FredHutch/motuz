import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'

import serializeForm from 'utils/serializeForm.jsx'

class SettingsDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const loading = false

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
                            <Button variant="primary" type='submit' disabled={loading}>
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
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideSettingsDialog()),
    onSubmit: data => dispatch(updateSettings(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
