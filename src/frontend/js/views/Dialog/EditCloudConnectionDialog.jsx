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
                        onSubmit={event => this.handleSubmit()}
                        ref={this.formRef}
                    >
                        <CloudConnectionDialogFields data={this.props.data} errors={this.props.errors}/>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger mr-auto" onClick={() => this.handleDelete()}>
                        Delete Connection
                    </Button>
                    <Button variant="secondary" onClick={() => this.handleClose()}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => this.handleSubmit()}>
                        Update Connection
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

    handleDelete() {
        const form = this.formRef.current;
        const data = serializeForm(form)

        this.props.onDelete(data);
    }

    componentDidMount() {

    }
}

EditCloudConnectionDialog.defaultProps = {
    data: {},
    errors: {},
    onClose: () => {},
    onSubmit: (data) => {},
    onDelete: (data) => {},
}

import {connect} from 'react-redux';
import {hideEditCloudConnectionDialog} from 'actions/dialogActions.jsx'
import {updateCloudConnection, deleteCloudConnection} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.editCloudConnectionDialogData,
    errors: state.api.cloudErrors,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideEditCloudConnectionDialog()),
    onSubmit: data => dispatch(updateCloudConnection(data)),
    onDelete: data => dispatch(deleteCloudConnection(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCloudConnectionDialog);
