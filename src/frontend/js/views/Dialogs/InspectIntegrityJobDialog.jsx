import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'

import serializeForm from 'utils/serializeForm.jsx'

class InspectIntegrityJobDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        console.log(data)

        return (
            <div className='dialog-inspect-integrity'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#">
                        <Modal.Header closeButton>
                            <Modal.Title>Integrity Check Result</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                Content Comes here
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => this.handleClose()}>
                                Close
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
}

InspectIntegrityJobDialog.defaultProps = {
    data: {},
    onClose: () => {},
}

import {connect} from 'react-redux';
import {hideInspectIntegrityJobDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.inspectIntegrityJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideInspectIntegrityJobDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(InspectIntegrityJobDialog);
