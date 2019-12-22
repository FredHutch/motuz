import React from 'react';
import { Modal, Button } from 'react-bootstrap'

import CloudConnectionDialogFields from 'views/Dialogs/CloudConnection/CloudConnectionDialogFields.jsx';
import VerifyStatusButton from 'views/Dialogs/CloudConnection/VerifyStatusButton.jsx'
import serializeForm from 'utils/serializeForm.jsx';
import Icon from 'components/Icon.jsx'

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
                <form
                    action="#"
                    onSubmit={event => this.handleSubmit(event)}
                    ref={this.formRef}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Edit Cloud Connection
                            <a
                                target="_blank"
                                href="https://sciwiki.fredhutch.org/compdemos/motuz/#add-a-new-cloud-connection-to-motuz"
                                className='ml-2'
                            >
                                <Icon name='question' verticalAlign='middle'></Icon>
                            </a>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <CloudConnectionDialogFields
                                data={this.props.data}
                                errors={this.props.errors}
                                verifySuccess={(this.props.cloudConnectionVerification.success === true)}
                                isSanitized={true}
                            />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger mr-auto" onClick={() => this.handleDelete()}>
                            Delete Connection
                        </Button>
                        <div className="mr-auto">
                            <Button variant="info" onClick={() => this.handleVerify()}>
                                Verify Connection
                            </Button>
                            <VerifyStatusButton {...this.props.cloudConnectionVerification} />
                        </div>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Update Connection
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        );
    }

    componentDidMount() {

    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const data = serializeForm(form)

        this.props.onSubmit(data);
    }

    handleVerify() {
        const form = this.formRef.current;

        if (!form.checkValidity()) {
            form.reportValidity()
            return
        }

        const data = serializeForm(form)
        this.props.onVerify(data);
    }

    handleDelete() {
        const form = this.formRef.current;
        const data = serializeForm(form)

        if (confirm(`Are you sure you want to delete connection ${data.name}?\n\n` +
            `This will delete data for all copy jobs related to this connection.`
        )) {
            this.props.onDelete(data);
        }
    }

}

EditCloudConnectionDialog.defaultProps = {
    data: {},
    cloudConnectionVerification: {
        loading: false,
        success: null,
    },
    errors: {},
    onClose: () => {},
    onSubmit: (data) => {},
    onDelete: (data) => {},
    onVerify: (data) => {},
}

import {connect} from 'react-redux';
import {hideEditCloudConnectionDialog} from 'actions/dialogActions.jsx'
import {updateCloudConnection, deleteCloudConnection, verifyCloudConnection} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.editCloudConnectionDialogData,
    cloudConnectionVerification: state.api.cloudConnectionVerification,
    errors: state.api.cloudErrors,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideEditCloudConnectionDialog()),
    onSubmit: data => dispatch(updateCloudConnection(data)),
    onDelete: data => dispatch(deleteCloudConnection(data)),
    onVerify: data => dispatch(verifyCloudConnection(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCloudConnectionDialog);
