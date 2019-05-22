import React from 'react';
import { Modal, Button } from 'react-bootstrap'

class CopyJobDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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
                        <form>
                            <div className="container">
                                <h5 className="text-primary">Source</h5>

                                <div className="row">
                                    <div className="col-4 text-right">
                                        <b>Cloud</b>
                                    </div>
                                    <div className="col-7">{'localhost'}</div>
                                    <div className="col-1"></div>
                                </div>
                                <div className="row">
                                    <div className="col-4 text-right">
                                        <b>Resource</b>
                                    </div>
                                    <div className="col-7">{'/'}</div>
                                    <div className="col-1"></div>
                                </div>

                                <h5 className="text-primary">Destination</h5>

                                <div className="row">
                                    <div className="col-4 text-right">
                                        <b>Cloud</b>
                                    </div>
                                    <div className="col-7">{'localhost'}</div>
                                    <div className="col-1"></div>
                                </div>
                                <div className="row">
                                    <div className="col-4 text-right">
                                        <b>Path</b>
                                    </div>
                                    <div className="col-7">{'/'}</div>
                                    <div className="col-1"></div>
                                </div>

                                <h5 className='text-primary'>Permissions</h5>

                                <div className="row">
                                    <div className="col-4 text-right">
                                        <b>Owner</b>
                                    </div>
                                    <div className="col-7">{'Unknown'}</div>
                                    <div className="col-1"></div>
                                </div>
                            </div>
                        </form>
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
    onClose: () => {},
}

import {connect} from 'react-redux';
import {hideCopyJobDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideCopyJobDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyJobDialog);
