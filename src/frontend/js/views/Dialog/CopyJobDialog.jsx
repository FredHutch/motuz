import React from 'react';
import { Modal, Button } from 'react-bootstrap'

class CopyJobDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        console.log(data)

        return (
            <div className='dialog-copy-job'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>New Copy Job</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <h5 className="text-primary mb-2">Source</h5>

                            <div className="row">
                                <div className="col-4 text-right">
                                    <b>Cloud</b>
                                </div>
                                <div className="col-7">{data['source_cloud'].name}</div>
                                <div className="col-1"></div>
                            </div>
                            <div className="row">
                                <div className="col-4 text-right">
                                    <b>Resource</b>
                                </div>
                                <div className="col-7">{data['source_resource']}</div>
                                <div className="col-1"></div>
                            </div>

                            <h5 className="text-primary mt-5 mb-2">Destination</h5>

                            <div className="row">
                                <div className="col-4 text-right">
                                    <b>Cloud</b>
                                </div>
                                <div className="col-7">{data['destination_cloud'].name}</div>
                                <div className="col-1"></div>
                            </div>
                            <div className="row">
                                <div className="col-4 text-right">
                                    <b>Path</b>
                                </div>
                                <div className="col-7">{data['destination_path']}</div>
                                <div className="col-1"></div>
                            </div>

                            <h5 className='text-primary mt-5 mb-2'>Permissions</h5>

                            <div className="row">
                                <div className="col-4 text-right">
                                    <b>Owner</b>
                                </div>
                                <div className="col-7">{data['owner']}</div>
                                <div className="col-1"></div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.handleClose()}>
                            Submit Copy Job
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    handleClose() {
        this.props.onClose();
    }

    componentDidMount() {

    }
}

CopyJobDialog.defaultProps = {
    data: {},
    onClose: () => {},
}

import {connect} from 'react-redux';
import {hideCopyJobDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.copyJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideCopyJobDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyJobDialog);
