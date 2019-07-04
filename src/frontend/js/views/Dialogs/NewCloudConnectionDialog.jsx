import React from 'react';
import { Modal, Button } from 'react-bootstrap'

import CloudConnectionDialogFields from 'views/Dialogs/CloudConnectionDialogFields.jsx';
import serializeForm from 'utils/serializeForm.jsx';


class NewCloudConnectionDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {errors} = this.props

        return (
            <Modal
                show={true}
                size="lg"
                onHide={() => this.handleClose()}
            >
                <form
                    action="#"
                    onSubmit={event => this.handleSubmit(event)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>New Cloud Connection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <CloudConnectionDialogFields
                                data={{}}
                                errors={errors}
                            />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Create Cloud Connection
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

        const data = serializeForm(event.target)
        this.props.onSubmit(data);
    }

    componentDidMount() {

    }
}

NewCloudConnectionDialog.defaultProps = {
    onClose: () => {},
    onSubmit: (data) => {},
    errors: {},
}

import {connect} from 'react-redux';
import {hideNewCloudConnectionDialog} from 'actions/dialogActions.jsx'
import {createCloudConnection} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    errors: state.api.cloudErrors,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideNewCloudConnectionDialog()),
    onSubmit: data => dispatch(createCloudConnection(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewCloudConnectionDialog);
