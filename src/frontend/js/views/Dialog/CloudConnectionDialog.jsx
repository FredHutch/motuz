import React from 'react';
import { Modal, Button } from 'react-bootstrap'

import serializeForm from 'utils/serializeForm.jsx';

const CONNECTION_TYPES = [
    'Amazon Simple Storage Service (S3)',
    'Azure Blob Storage',
    'Google Cloud Bucket'
]


class CloudConnectionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
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
                        <form
                            action="#"
                            onSubmit={event => evnet.preventDefault}
                            ref={this.formRef}
                        >
                            <div className="container">
                                <h5 className="text-primary mb-2">Details</h5>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Type</b>
                                    </div>
                                    <div className="col-8">
                                        <select
                                            className="form-control"
                                            name="type"
                                        >
                                            {CONNECTION_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Name</b>
                                    </div>
                                    <div className="col-8">
                                        <input
                                            type="text"
                                            className='form-control'
                                            name='name'
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Bucket</b>
                                    </div>
                                    <div className="col-8">
                                        <input
                                            type="text"
                                            className='form-control'
                                            name='bucket'
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Region</b>
                                    </div>
                                    <div className="col-8">
                                        <input
                                            type="text"
                                            className='form-control'
                                            name='region'
                                        />
                                    </div>
                                </div>


                                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>access_key_id</b>
                                    </div>
                                    <div className="col-8">
                                        <input
                                            type="text"
                                            className='form-control'
                                            name='access_key_id'
                                        />
                                    </div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>access_key_secret</b>
                                    </div>
                                    <div className="col-8">
                                        <input
                                            type="text"
                                            className='form-control'
                                            name='access_key_secret'
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
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
        const form = this.formRef.current;
        const data = serializeForm(form)

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
import {createCloudConnection} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.copyJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideCloudConnectionDialog()),
    onSubmit: data => dispatch(createCloudConnection(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CloudConnectionDialog);
