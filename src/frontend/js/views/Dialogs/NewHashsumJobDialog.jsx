import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'

import serializeForm from 'utils/serializeForm.jsx'

class NewHashsumJobDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        return (
            <div className='dialog-integrity'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#" onSubmit={(event) => this.handleSubmit(event)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Check Integrity</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                {data.source_paths.map((sourcePath, i) => (
                                    <React.Fragment key={sourcePath}>
                                        {i !== 0 && <hr className='mt-4' />}

                                        <h5 className="text-primary mb-2">Compare</h5>

                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Cloud</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {data['source_cloud'].name}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Resource</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {sourcePath}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>

                                        <h5 className="text-primary mt-4 mb-2">With</h5>

                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Cloud</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {data['destination_cloud'].name}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Path</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {data['destination_paths'][i]}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit'>
                                Check hashes
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
        const formData = serializeForm(event.target);

        for (let i in propsData.source_paths) {
            const src_resource_path = propsData.source_paths[i]
            const dst_resource_path = propsData.destination_paths[i]
            const data = {
                "src_cloud_id": propsData['source_cloud'].id,
                "src_resource_path": src_resource_path,
                "dst_cloud_id": propsData['destination_cloud'].id,
                "dst_resource_path": dst_resource_path,
            }

            if (!data['src_cloud_id']) {
                delete data['src_cloud_id'];
            }
            if (!data['dst_cloud_id']) {
                delete data['dst_cloud_id'];
            }

            this.onSubmit(data);

            break // TODO - allow multiple selection as well
        }
    }

    onSubmit(data) {
        this.props.onSubmit(data)
    }
}

NewHashsumJobDialog.defaultProps = {
    data: {},
    followSymlinksDefault: false,
    onClose: () => {},
    onSubmit: (data) => {console.log(data)},
}

import {connect} from 'react-redux';
import {hideNewHashsumJobDialog, showEditHashsumJobDialog} from 'actions/dialogActions.jsx'
import {createHashsumJob} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.newHashsumJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideNewHashsumJobDialog()),
    onSubmit: data => {
        dispatch(hideNewHashsumJobDialog())
        dispatch(createHashsumJob(data))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewHashsumJobDialog);
