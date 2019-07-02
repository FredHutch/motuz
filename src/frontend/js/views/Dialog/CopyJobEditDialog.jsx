import React from 'react';

import { Modal, Button, ProgressBar } from 'react-bootstrap'

import serializeForm from 'utils/serializeForm.jsx'

class CopyJobEditDialog extends React.Component {
    constructor(props) {
        super(props);
        this.intervalHandler = 0;
    }

    render() {
        const data = this.props.jobs.find(d => d.id === this.props.data.id)

        const description = data.description ? ` - ${data.description}` : ''
        const progressText = data.progress_text;
        const progress = data.progress_current / data.progress_total * 100;

        const isInProgress = data.progress_state === 'PROGRESS'

        return (
            <div className='dialog-edit-copy-job'>
                <Modal
                    show={true}
                    size='lg'
                    onHide={() => this.handleClose()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Copy Job {data.id}{description}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="form-group">
                                <ProgressBar
                                    now={progress}
                                    label={`${progress}%`}
                                    variant='success'
                                    style={{width: '100%', height: 30}}
                                />
                            </div>

                            <h5 className="text-primary mb-2">Details</h5>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Source</b>
                                </div>
                                <div className="col-7 text-left">
                                    <span><b>{data.src_cloud}</b></span>
                                    <span>:</span>
                                    <span>{data.src_resource}</span>
                                </div>
                                <div className="col-1"></div>
                            </div>
                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Destination</b>
                                </div>
                                <div className="col-7 text-left">
                                    <span><b>{data.dst_cloud}</b></span>
                                    <span>:</span>
                                    <span>{data.dst_path}</span>
                                </div>
                                <div className="col-1"></div>
                            </div>

                            <h5 className="text-primary mb-2">Output</h5>

                            <div className="form-group">
                                <pre><code>
                                    {progressText}
                                </code></pre>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {isInProgress && (
                            <Button className='mr-auto' variant="danger" onClick={() => this.stopJob()}>
                                Stop Job
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    handleClose() {
        this.props.onClose();
    }

    stopJob() {
        if (confirm(`Are you sure you want to stop job ${this.props.data.id}`)) {
            this.props.onStopJob(this.props.data.id)
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
}

CopyJobEditDialog.defaultProps = {
    data: {},
    jobs: [],
    fetchData: (id) => {},
    onClose: () => {},
}

import {connect} from 'react-redux';
import {hideCopyJobEditDialog} from 'actions/dialogActions.jsx'
import {stopCopyJob} from 'actions/apiActions.jsx';

const mapStateToProps = state => ({
    data: state.dialog.copyJobEditDialogData,
    jobs: state.api.jobs,
    onClose: () => {},
    onStopJob: id => {},
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideCopyJobEditDialog()),
    onStopJob: id => dispatch(stopCopyJob(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyJobEditDialog);
