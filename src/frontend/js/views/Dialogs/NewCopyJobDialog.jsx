import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'

import serializeForm from 'utils/serializeForm.jsx'

class NewCopyJobDialog extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef()
        this.state = {
            emailNotifications: props.emailNotificationsDefault,
        };
    }

    render() {
        const { data, isLoading } = this.props;

        return (
            <div className='dialog-copy-job'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#" onSubmit={(event) => this.handleSubmit(event)}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Copy Job</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                {data.source_paths.map((sourcePath, i) => (
                                    <React.Fragment key={sourcePath}>
                                        <h5 className="text-primary mb-2">Source</h5>

                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Connection</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {data['source_cloud'].name}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Resource</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {sourcePath}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>

                                        <h5 className="text-primary mt-4 mb-2">Destination</h5>

                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Connection</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {data['destination_cloud'].name}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Path</b>
                                            </div>
                                            <div className="col-7">
                                                <span className="form-label">
                                                    {data['destination_paths'][i]}
                                                </span>
                                            </div>
                                            <div className="col-1"></div>
                                        </div>

                                        <hr className='mt-4' />
                                    </React.Fragment>
                                ))}

                                <h5 className='text-primary mb-2'>Details</h5>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b className='form-label'>Owner</b>
                                    </div>
                                    <div className="col-7">
                                        <span className="form-label">
                                            {this.props.username}
                                        </span>
                                    </div>
                                    <div className="col-1"></div>
                                </div>

                                <div className="row form-group">
                                    <div className="col-4 text-right">
                                        <b className='form-label'>Description</b>
                                    </div>
                                    <div className="col-7">
                                        <input
                                            name="description"
                                            type="text"
                                            className="form-control"
                                            ref={this.inputRef}
                                        />
                                    </div>
                                    <div className="col-1"></div>
                                </div>

                                <details>
                                    <summary className='text-primary h5 mt-5 mb-2'>
                                        Advanced
                                    </summary>

                                    <div className="row form-group">
                                        <div className="col-4 text-right">
                                            <b className='form-label'>Follow symlinks</b>
                                        </div>
                                        <div className="col-7">
                                            <Toggle
                                                name='copy_links'
                                                className='form-label'
                                                defaultChecked={this.props.followSymlinksDefault}
                                            />
                                        </div>
                                        <div className="col-1"></div>
                                    </div>

                                    <div className="row form-group">
                                        <div className="col-4 text-right">
                                            <b className='form-label'>Email Notifications</b>
                                        </div>
                                        <div className="col-7">
                                            <Toggle
                                                className='form-label'
                                                defaultChecked={this.props.emailNotificationsDefault}
                                                onChange={(event) => this.setState({emailNotifications: event.target.checked})}
                                            />
                                        </div>
                                        <div className="col-1"></div>
                                    </div>

                                    {this.state.emailNotifications && (
                                        <div className="row form-group">
                                            <div className="col-4 text-right">
                                                <b className='form-label'>Email Address</b>
                                            </div>
                                            <div className="col-7">
                                                <input
                                                    name="notification_email"
                                                    type="email"
                                                    className="form-control"
                                                    required={true}
                                                    defaultValue={this.props.emailAddressDefault}
                                                />
                                            </div>
                                            <div className="col-1"></div>
                                        </div>
                                    )}
                                </details>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                Close
                            </Button>
                            <Button variant="primary" type='submit' disabled={isLoading}>
                                { isLoading ? "Submitting..." : "Submit Copy Job" }
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

        const propsData = this.props.data;
        const formData = serializeForm(event.target)

        for (let i in propsData.source_paths) {
            const src_resource_path = propsData.source_paths[i]
            const dst_resource_path = propsData.destination_paths[i]
            const data = {
                "description": formData['description'] || '',
                "copy_links": formData['copy_links'] || false,
                "src_cloud_id": propsData['source_cloud'].id,
                "src_resource_path": src_resource_path,
                "dst_cloud_id": propsData['destination_cloud'].id,
                "dst_resource_path": dst_resource_path,
                "notification_email": formData['notification_email'],
            }

            if (data['src_cloud_id'] === 0) {
                delete data['src_cloud_id'];
            }
            if (data['dst_cloud_id'] === 0) {
                delete data['dst_cloud_id'];
            }

            this.props.onSubmit(data);
        }
    }

    componentDidMount() {
        this.inputRef.current.focus()
    }
}

NewCopyJobDialog.defaultProps = {
    data: {},
    username: 'ERROR',

    isLoading: false,

    followSymlinksDefault: false,
    emailNotificationsDefault: false,
    emailAddressDefault: "",

    onClose: () => {},
    onSubmit: (data) => {},
}

import {connect} from 'react-redux';
import {hideNewCopyJobDialog} from 'actions/dialogActions.jsx'
import {createCopyJob} from 'actions/apiActions.jsx'
import { getCurrentUser } from 'reducers/authReducer.jsx';

const mapStateToProps = state => ({
    data: state.dialog.newCopyJobDialogData,
    username: getCurrentUser(state.auth),

    isLoading: state.loaders.createCopyJobLoading,

    followSymlinksDefault: state.settings.followSymlinks,
    emailNotificationsDefault: state.settings.emailNotifications,
    emailAddressDefault: state.settings.emailAddress,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideNewCopyJobDialog()),
    onSubmit: data => dispatch(createCopyJob(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewCopyJobDialog);
