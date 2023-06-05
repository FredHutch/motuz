import React, {Fragment} from 'react';
import { Modal, Button, ProgressBar } from 'react-bootstrap'

import UriResource from 'components/UriResource.jsx';
import parseTime from 'utils/parseTime.jsx'
import serializeForm from 'utils/serializeForm.jsx'

class EditCopyJobDialog extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = null;
    }

    render() {
        const { data, cloudMapping } = this.props;

        this.props.clouds.forEach(connection => {
            cloudMapping[connection.id] = connection
        })

        const description = data.description ? ` - ${data.description}` : ''
        const progressErrorText = data.progress_error_text;
        const progress = Math.floor(data.progress_current / data.progress_total * 100);
        const executionTime = parseTime(data.progress_execution_time);

        const isSuccess = data.progress_state === 'SUCCESS'
        const isInProgress = data.progress_state === 'PROGRESS'
        const isIncomplete = data.progress_state === 'FAILED' || data.progress_state === 'STOPPED'
        const dst_cloud = cloudMapping[this.props.data['dst_cloud_id'] || 0]
        const checkIntegrityDisabled = dst_cloud.type === 's3'

        let color = 'default';
        if (isSuccess) {
            color = 'success'
        } else if (isIncomplete) {
            color = 'danger'
        } else if (isInProgress) {
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
                            <span>Copy Job #{data.id}{description} - </span>
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
                                    <UriResource
                                        protocol={data.src_cloud_type}
                                        path={data.src_resource_path}
                                        canCopy={true}
                                    />
                                </div>
                                <div className="col-1"></div>
                            </div>
                            <div className="row form-group">
                                <div className="col-4 text-right">
                                    <b>Destination</b>
                                </div>
                                <div className="col-7 text-left">
                                    <UriResource
                                        protocol={data.dst_cloud_type}
                                        path={data.dst_resource_path}
                                        canCopy={true}
                                    />
                                </div>
                                <div className="col-1"></div>
                            </div>

                            {this.outputErrorText(data)}

                            {this.outputText(data)}

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {isInProgress && (
                            <Button variant="danger" onClick={() => this.stopJob()}>
                                Stop Job
                            </Button>
                        )}
                        {!isInProgress && isSuccess && (
                            <Fragment>
                                <Button variant="info"
                                        aria-disabled={checkIntegrityDisabled} disabled={checkIntegrityDisabled}
                                        onClick={() => this.showNewHashsumJobDialog()}>
                                    Check Integrity
                                </Button>
                                {checkIntegrityDisabled && (
                                    <div className="text-left pl-1">
                                        Integrity check not needed for S3 destinations
                                    </div>
                                )}
                            </Fragment>
                        )}
                        {!isInProgress && !isSuccess && (
                            <Button variant="success" onClick={() => this.showNewCopyJobDialog()}>
                                Retry
                            </Button>
                        )}
                        <Button className="ml-auto" variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        this.props.fetchData(this.props.data.id);
        this._scheduleRefresh()
    }

    componentDidUpdate() {
        this._scheduleRefresh()
    }

    componentWillUnmount() {
        this._clearTimeout()
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

    showNewHashsumJobDialog() {
        const data = this._generateDialogData();
        this.props.onClose();
        this.props.onShowNewHashsumJobDialog(data)
    }

    showNewCopyJobDialog() {
        if (confirm("You may overwrite files at the destination. Are you sure you want to continue?")) {
            const data = this._generateDialogData();
            this.props.onClose()
            this.props.onShowNewCopyJobDialog(data)
        }
    }

    _generateDialogData() {
        const { cloudMapping } = this.props;

        const src_cloud_id = this.props.data['src_cloud_id'] || 0
        const src_cloud = cloudMapping[src_cloud_id]

        const dst_cloud_id = this.props.data['dst_cloud_id'] || 0
        const dst_cloud = cloudMapping[dst_cloud_id]

        const src_cloud_name = (src_cloud == undefined ? "(unknown)" : src_cloud.name);
        const dst_cloud_name = (dst_cloud == undefined ? "(unknown)" : dst_cloud.name);

        return {
            source_cloud: {
                id: src_cloud_id,
                name: src_cloud_name,
            },
            source_paths: [this.props.data.src_resource_path],
            destination_cloud: {
                id: this.props.data.dst_cloud_id,
                name: dst_cloud_name,
            },
            destination_paths: [this.props.data.dst_resource_path],
        }
    }

    _scheduleRefresh() {
        const refreshDelay = 1000; // 1s
        this._clearTimeout();
        this.timeout = setTimeout(() => {
            if (this.props.data.progress_state === 'PROGRESS') {
                this.props.fetchData(this.props.data.id);
            }
        }, refreshDelay)
    }

    _clearTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

EditCopyJobDialog.defaultProps = {
    data: {},
    clouds: [],
    cloudMapping: {
        0: { name: 'rhino' },
    },
    fetchData: (id) => {},
    onClose: () => {},
    onStopJob: id => {},
    onShowNewHashsumJobDialog: (data) => {},
    onShowNewCopyJobDialog: (data) => {},
}

import {connect} from 'react-redux';
import {
    hideEditCopyJobDialog,
    showNewHashsumJobDialog,
    showNewCopyJobDialog,
} from 'actions/dialogActions.jsx'
import {retrieveCopyJob, stopCopyJob} from 'actions/apiActions.jsx';


const mapStateToProps = state => ({
    data: state.dialog.editCopyJobDialogData,
    clouds: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    fetchData: (id) => dispatch(retrieveCopyJob(id)),
    onClose: () => dispatch(hideEditCopyJobDialog()),
    onStopJob: id => dispatch(stopCopyJob(id)),
    onShowNewHashsumJobDialog: (data) => dispatch(showNewHashsumJobDialog(data)),
    onShowNewCopyJobDialog: (data) => dispatch(showNewCopyJobDialog(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCopyJobDialog);
