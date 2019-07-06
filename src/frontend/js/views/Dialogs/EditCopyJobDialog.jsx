import React from 'react';
import { Modal, Button, ProgressBar } from 'react-bootstrap'

import parseTime from 'utils/parseTime.jsx'
import serializeForm from 'utils/serializeForm.jsx'

class EditCopyJobDialog extends React.Component {
    constructor(props) {
        super(props);
        this.intervalHandler = 0;
    }

    render() {
        const data = this.props.jobs.find(d => d.id === this.props.data.id)

        const description = data.description ? ` - ${data.description}` : ''
        const progressErrorText = data.progress_error_text;
        const progress = Math.floor(data.progress_current / data.progress_total * 100);
        const executionTime = parseTime(data.progress_execution_time);

        const isInProgress = data.progress_state === 'PROGRESS'

        let color = 'default';
        if (data.progress_state === 'SUCCESS') {
            color = 'success'
        } else if (data.progress_state === 'FAILED' || data.progress_state === 'STOPPED') {
            color = 'danger'
        } else if (data.progress_state === 'PROGRESS') {
            color = 'primary'
        }

        return (
            <div className='dialog-edit-copy-job'>
                <Modal
                    show={true}
                    size='lg'
                    onHide={() => this.handleClose()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <span>Copy Job {data.id}{description} - </span>
                            <b className={`text-${color}`}>
                                {data.progress_state}
                            </b>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            <div className="form-group">
                                <div className="text-center">
                                    <b className={`text-${color}`}>{executionTime}</b>
                                </div>
                                <ProgressBar
                                    now={progress}
                                    label={`${progress}%`}
                                    variant={color}
                                    style={{width: '100%', height: 30}}
                                />
                            </div>

                            <h5 className="text-primary mb-2">Details</h5>

                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Source</b>
                                </div>
                                <div className="col-7 text-left">
                                    <span><b>{data.src_cloud_type}</b></span>
                                    <span>://</span>
                                    <span>{data.src_resource}</span>
                                </div>
                                <div className="col-1"></div>
                            </div>
                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Destination</b>
                                </div>
                                <div className="col-7 text-left">
                                    <span><b>{data.dst_cloud_type}</b></span>
                                    <span>://</span>
                                    <span>{data.dst_path}</span>
                                </div>
                                <div className="col-1"></div>
                            </div>

                            {this.outputErrorText(data)}

                            {this.outputText(data)}

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

    componentDidMount() {

    }

    outputText(data) {
        if (!data.progress_text) {
            return <React.Fragment />
        }

        return (
            <React.Fragment>
                <h5 className="text-primary mb-2">Output</h5>
                <div className="form-group">
                    <pre className='copy-job-blob'><code>
                        {data.progress_text}
                    </code></pre>
                </div>
            </React.Fragment>
        )
    }

    outputErrorText(data) {
        if (!data.progress_error_text) {
            return <React.Fragment />
        }

        return (
            <React.Fragment>
                <h5 className="text-primary mb-2">Errors</h5>
                <div className="form-group">
                    <pre className='copy-job-blob'><code>
                        {data.progress_error_text}
                    </code></pre>
                </div>
            </React.Fragment>
        )
    }

    handleClose() {
        this.props.onClose();
    }

    stopJob() {
        if (confirm(`Are you sure you want to stop job ${this.props.data.id}`)) {
            this.props.onStopJob(this.props.data.id)
        }
    }
}

EditCopyJobDialog.defaultProps = {
    data: {},
    jobs: [],
    fetchData: (id) => {},
    onClose: () => {},
}

import {connect} from 'react-redux';
import {hideEditCopyJobDialog} from 'actions/dialogActions.jsx'
import {stopCopyJob} from 'actions/apiActions.jsx';

const mapStateToProps = state => ({
    data: state.dialog.editCopyJobDialogData,
    jobs: state.api.jobs,
    onClose: () => {},
    onStopJob: id => {},
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideEditCopyJobDialog()),
    onStopJob: id => dispatch(stopCopyJob(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCopyJobDialog);
