import React from 'react';
import { Modal, Button } from 'react-bootstrap'

class CloudConnectionDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        return (
            <div className='dialog-copy-job'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>New Cloud Connection</Modal.Title>
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
                        <Button variant="primary" onClick={() => this.handleSubmit()}>
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

    handleSubmit() {
        const formData = this.props.data;

        const data = {
            "description": `Task ${Math.floor(Math.random() * 100)}`,
            "src_cloud": formData['source_cloud'].name,
            "src_resource": formData['source_resource'],
            "dst_cloud": formData['destination_cloud'].name,
            "dst_path": formData['destination_path'],
            "owner": "owner"
        }
        this.props.onSubmit(data);
    }

    componentDidMount() {

    }
}

CloudConnectionDialog.defaultProps = {
    data: {},
    onClose: () => {},
    onSubmit: (data) => {},
}

import {connect} from 'react-redux';
import {hideCloudConnectionDialog} from 'actions/dialogActions.jsx'
import {createCopyJob} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.copyJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideCloudConnectionDialog()),
    onSubmit: data => dispatch(createCopyJob(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CloudConnectionDialog);
