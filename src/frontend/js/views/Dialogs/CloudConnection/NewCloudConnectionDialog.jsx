import React from 'react';
import classnames from 'classnames';
import { Modal, Button } from 'react-bootstrap'

import CloudConnectionDialogFields from 'views/Dialogs/CloudConnection/CloudConnectionDialogFields.jsx';
import VerifyStatusButton from 'views/Dialogs/CloudConnection/VerifyStatusButton.jsx'
import Icon from 'components/Icon.jsx'
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
                <form
                    action="#"
                    onSubmit={event => this.handleSubmit(event)}
                    ref={this.formRef}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            New Cloud Connection
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
                            data={{
                                s3_region: 'us-west-2',
                                sftp_port: '22',
                            }}
                            errors={errors}
                            verifySuccess={(this.props.cloudConnectionVerification.success === true)}
                            isSanitized={false}
                        />
                    </Modal.Body>
                    <Modal.Footer>
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

    handleVerify() {
        const form = this.formRef.current;

        if (!form.checkValidity()) {
            form.reportValidity()
            return
        }

        const data = serializeForm(form)
        this.props.onVerify(data);
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
    errors: {},
    data: {},
    cloudConnectionVerification: {
        loading: false,
        success: null,
    },
    onClose: () => {},
    onSubmit: (data) => {},
    onVerify: (data) => {},
}

import {connect} from 'react-redux';
import {hideNewCloudConnectionDialog} from 'actions/dialogActions.jsx'
import {createCloudConnection, verifyCloudConnection} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    errors: state.api.cloudErrors,
    data: state.dialog.newCloudConnectionDialogData,
    cloudConnectionVerification: state.api.cloudConnectionVerification,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideNewCloudConnectionDialog()),
    onSubmit: data => dispatch(createCloudConnection(data)),
    onVerify: data => dispatch(verifyCloudConnection(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewCloudConnectionDialog);
