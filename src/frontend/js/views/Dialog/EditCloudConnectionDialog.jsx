import React from 'react';
import { Modal, Button } from 'react-bootstrap'

import CloudConnectionDialogFields from 'views/Dialog/CloudConnectionDialogFields.jsx';
import serializeForm from 'utils/serializeForm.jsx';


class EditCloudConnectionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
    }

    render() {
        const { data } = this.props;

        return (
            <Modal
                show={true}
                size="lg"
                onHide={() => this.handleClose()}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Cloud Connection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        action="#"
                        onSubmit={event => event.preventDefault()}
                        ref={this.formRef}
                    >
                        <CloudConnectionDialogFields data={data} />
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => this.handleClose()}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={() => this.handleClose()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => this.handleSubmit()}>
                        Create Cloud Connection
                    </Button>
                </Modal.Footer>
            </Modal>
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

EditCloudConnectionDialog.defaultProps = {
    data: {},
    onClose: () => {},
    onSubmit: (data) => {},
}

import {connect} from 'react-redux';
import {hideEditCloudConnectionDialog} from 'actions/dialogActions.jsx'
import {updateCloudConnection} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.copyJobDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideEditCloudConnectionDialog()),
    onSubmit: data => dispatch(updateCloudConnection(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCloudConnectionDialog);
