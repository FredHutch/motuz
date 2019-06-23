import React from 'react';

import { Modal, Button, ProgressBar } from 'react-bootstrap'

import serializeForm from 'utils/serializeForm.jsx'

class CopyJobEditDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        const description = data.description ? ` - ${data.description}` : ''
        const progressText = data.progress_text;
        const progress = data.progress_current / data.progress_total * 100;

        console.log(data)

        return (
            <div className='dialog-edit-copy-job'>
                <Modal
                    show={true}
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

                            <div className="form-group">
                                <div className="col-4 text-right">
                                    <b>Source</b>
                                </div>
                                <div className="col-1"></div>
                            </div>
                            <div className="form-group">
                                <div className="col-4 text-right">
                                    <b>Destination</b>
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

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

CopyJobEditDialog.defaultProps = {
    data: {},
    onClose: () => {},
}

import {connect} from 'react-redux';
import {hideCopyJobEditDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.copyJobEditDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideCopyJobEditDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyJobEditDialog);
