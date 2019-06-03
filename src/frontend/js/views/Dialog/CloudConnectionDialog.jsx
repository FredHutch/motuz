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
                            <h5 className="text-primary mb-2">Details</h5>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Type</b>
                                </div>
                                <div className="col-8">
                                    <input type="text" className='form-control'/>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Name</b>
                                </div>
                                <div className="col-8">
                                    <input type="text" className='form-control'/>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Bucket</b>
                                </div>
                                <div className="col-8">
                                    <input type="text" className='form-control'/>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Region</b>
                                </div>
                                <div className="col-8">
                                    <input type="text" className='form-control'/>
                                </div>
                            </div>


                            <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>access_key_id</b>
                                </div>
                                <div className="col-8">
                                    <input type="text" className='form-control'/>
                                </div>
                            </div>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>access_key_secret</b>
                                </div>
                                <div className="col-8">
                                    <input type="text" className='form-control'/>
                                </div>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.handleSubmit()}>
                            Create Cloud Connection
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
