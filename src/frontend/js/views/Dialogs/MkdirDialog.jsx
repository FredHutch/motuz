import React from 'react';

import { Modal, Button } from 'react-bootstrap'

import serializeForm from 'utils/serializeForm.jsx'

class MkdirDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { host, path } = this.props.data;
        const uri = `${host.type}://${path}`

        return (
            <div className='dialog-copy-job'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#" onSubmit={(event) => this.handleSubmit(event)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Make Directory</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                <input
                                    type="hidden"
                                    name="connection_id"
                                    value={host.id}
                                />
                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Path</b>
                                    </div>
                                    <div className="col-7">
                                        <b>{host.type}</b>
                                        <span>://</span>
                                        <span>{path}</span>
                                    </div>
                                    <input type="hidden" name="path_prefix" value={path}/>
                                    <div className="col-1"></div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b>Directory Name</b>
                                    </div>
                                    <div className="col-7">
                                        <input
                                            className="form-control"
                                            type="text"
                                            name="path_suffix"
                                        />
                                    </div>
                                    <div className="col-1"></div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                Cancel
                            </Button>
                            <Button variant="primary" type='submit'>
                                Make Directory
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

    handleSubmit(event) {
        event.preventDefault();

        const form_data = serializeForm(event.target)

        const data = {
            path: `${form_data.path_prefix}/${form_data.path_suffix}`,
            connection_id: window.parseInt(form_data.connection_id),
        }

        this.props.onSubmit(data);
    }

    componentDidMount() {

    }
}

MkdirDialog.defaultProps = {
    data: {},
    onClose: () => {},
    onSubmit: (data) => {},
}

import {connect} from 'react-redux';
import {hideMkdirDialog} from 'actions/dialogActions.jsx'
import {makeDirectory} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.mkdirDialogData,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideMkdirDialog()),
    onSubmit: data => dispatch(makeDirectory(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MkdirDialog);
