import React from 'react';
import { Modal, Button } from 'react-bootstrap'

import UriResource from 'components/UriResource.jsx'
import serializeForm from 'utils/serializeForm.jsx'

class SettingsDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const loading = false

        return (
            <div className='dialog-copy-job'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#" onSubmit={(event) => this.handleSubmit(event)}>
                        <Modal.Header closeButton>
                            <Modal.Title>User Settings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit' disabled={loading}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
    }

    handleClose() {
        this.props.onClose();
    }

    handleSubmit(event) {
        event.preventDefault();

        const form_data = serializeForm(event.target)

        this.props.onSubmit(data);
    }

}

SettingsDialog.defaultProps = {
    data: {},
    onClose: () => {},
    onSubmit: (data) => {},
}

import {connect} from 'react-redux';
import {hideSettingsDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideSettingsDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
