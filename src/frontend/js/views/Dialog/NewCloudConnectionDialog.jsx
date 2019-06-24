import React from 'react';
import { Modal, Button } from 'react-bootstrap'

import CloudConnectionDialogFields from 'views/Dialog/CloudConnectionDialogFields.jsx';
import serializeForm from 'utils/serializeForm.jsx';


class NewCloudConnectionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
    }

    render() {
        const {errors} = this.props

        return (
            <Modal
                show={true}
                size="lg"
                onHide={() => this.handleClose()}
            >
                <Modal.Header closeButton>
                    <Modal.Title>New Cloud Connection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        action="#"
                        onSubmit={event => event.handleSubmit()}
                        ref={this.formRef}
                    >
                        <CloudConnectionDialogFields data={{}} errors={errors} />
                    </form>
                </Modal.Body>
                <Modal.Footer>
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
