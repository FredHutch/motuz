import React from 'react';
import {Modal, Button} from 'react-bootstrap'

class CopyJobDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Modal show={true} onHide={() => this.handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.handleClose()}>
                            Save Changes
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
