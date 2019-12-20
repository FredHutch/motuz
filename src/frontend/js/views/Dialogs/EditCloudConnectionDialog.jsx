import React from 'react';
import { Modal, Button } from 'react-bootstrap'

import CloudConnectionDialogFields from 'views/Dialogs/CloudConnectionDialogFields.jsx';
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
                            <CloudConnectionDialogFields data={this.props.data} errors={this.props.errors}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger mr-auto" onClick={() => this.handleDelete()}>
                            Delete Connection
                        </Button>
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

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const data = serializeForm(form)

        this.props.onSubmit(data);
    }

    handleDelete() {
        const form = this.formRef.current;
        const data = serializeForm(form)

        if (confirm(`Are you sure you want to delete connection ${data.name}`)) {
            this.props.onDelete(data);
        }
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
