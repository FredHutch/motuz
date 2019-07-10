import React from 'react';

import { Modal, Button } from 'react-bootstrap'

import serializeForm from 'utils/serializeForm.jsx'

class NewCopyJobDialog extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef()
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
                    <form action="#" onSubmit={(event) => this.handleSubmit(event)}>
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
                                    <div className="col-7">{data['src_resource_path']}</div>
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

                                <h5 className='text-primary mt-5 mb-2'>Details</h5>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Owner</b>
                                    </div>
                                    <div className="col-7">{data['owner']}</div>
                                    <div className="col-1"></div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Description</b>
                                    </div>
                                    <div className="col-7">
                                        <input
                                            name="description"
                                            type="text"
                                            className="form-control"
                                            ref={this.inputRef}
                                        />
                                    </div>
                                    <div className="col-1"></div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit'>
                                Submit Copy Job
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(event) {
        event.preventDefault();

        const propsData = this.props.data;
        const formData = serializeForm(event.target)

        const data = {
            "description": formData['description'] || '',
            "src_cloud_id": propsData['source_cloud'].id,
            "src_resource_path": propsData['src_resource_path'],
            "dst_cloud_id": propsData['destination_cloud'].id,
            "dst_resource_path": propsData['destination_path'],
            "owner": "owner"
        }

        if (data['src_cloud_id'] === 0) {
            delete data['src_cloud_id'];
        }
        if (data['dst_cloud_id'] === 0) {
            delete data['dst_cloud_id'];
        }

        this.props.onSubmit(data);
    }

    componentDidMount() {
        this.inputRef.current.focus()
    }
}

NewCopyJobDialog.defaultProps = {
    data: {},
    onClose: () => {},
    onSubmit: (data) => {},
}

import {connect} from 'react-redux';
import {hideNewCopyJobDialog} from 'actions/dialogActions.jsx'
import {createCopyJob} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.newCopyJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideNewCopyJobDialog()),
    onSubmit: data => dispatch(createCopyJob(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewCopyJobDialog);
