import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import Toggle from 'react-toggle'

import serializeForm from 'utils/serializeForm.jsx'
import ToggleInfo from 'components/ToggleInfo.jsx'


class NewHashsumJobDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailNotifications: props.emailNotificationsDefault,
        }
    }

    render() {
        const { data, isLoading } = this.props;

        return (
            <div className='dialog-integrity'>
                <Modal
                    show={true}
                    size="lg"
                    onHide={() => this.handleClose()}
                >
                    <form action="#" onSubmit={(event) => this.handleSubmit(event)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Check Integrity <b>(Experimental)</b></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="container">
                                {data.source_paths.map((sourcePath, i) => (
                                    <React.Fragment key={sourcePath}>
                                        {i !== 0 && <hr className='mt-4' />}

                                        <h5 className="text-primary mb-2">Compare</h5>

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

                                        <h5 className="text-primary mt-4 mb-2">With</h5>

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

                                        <details>
                                            <summary className='text-primary h5 mt-5 mb-2'>
                                                Advanced
                                            </summary>

                                            <div className="row form-group">
                                                <div className="col-4 text-right">
                                                    <b className='form-label'>Double Check</b>
                                                    <ToggleInfo
                                                        className='form-label ml-2'
                                                        off="Quick check. This option relies on the MD5 sums that clouds record for files at the time of transfer. This check is sufficient for most users, but it is not guaranteed to be correct."
                                                        on="Slow check. This option downloads all files from the cloud to ensure that the MD5 match. This option is guaranteed to always be correct."
                                                    />
                                                </div>
                                                <div className="col-7">
                                                    <Toggle
                                                        name='option_download'
                                                        className='form-label'
                                                        defaultChecked={this.props.false}
                                                    />
                                                </div>
                                                <div className="col-1"></div>
                                            </div>

                                            <div className="row form-group">
                                                <div className="col-4 text-right">
                                                    <b className='form-label'>Email Notifications</b>
                                                    <ToggleInfo
                                                        className='form-label ml-2'
                                                        on="Automatically receive an email when jobs are complete."
                                                        off="No automatic emails are send on when jobs are complete, unless manually specified in the job itself."
                                                    />
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
                                    </React.Fragment>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleClose()}>
                                Close
                            </Button>
                            <Button variant="primary" type='submit' disabled={isLoading}>
                                { isLoading ? "Checking..." : "Check hashes" }
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
        const formData = serializeForm(event.target);

        for (let i in propsData.source_paths) {
            const src_resource_path = propsData.source_paths[i]
            const dst_resource_path = propsData.destination_paths[i]
            const data = {
                "src_cloud_id": propsData['source_cloud'].id,
                "src_resource_path": src_resource_path,
                "dst_cloud_id": propsData['destination_cloud'].id,
                "dst_resource_path": dst_resource_path,
                "option_download": formData['option_download'],
                "notification_email": formData['notification_email'],
            }

            if (!data['src_cloud_id']) {
                delete data['src_cloud_id'];
            }
            if (!data['dst_cloud_id']) {
                delete data['dst_cloud_id'];
            }

            this.onSubmit(data);

            break // TODO - allow multiple selection as well
        }
    }

    onSubmit(data) {
        this.props.onSubmit(data)
    }
}

NewHashsumJobDialog.defaultProps = {
    data: {},

    isLoading: false,

    followSymlinksDefault: false,
    doubleCheckDefault: false,
    emailNotificationsDefault: false,
    emailAddressDefault: "",

    onClose: () => {},
    onSubmit: (data) => {},
}


import {connect} from 'react-redux';
import {hideNewHashsumJobDialog} from 'actions/dialogActions.jsx'
import {createHashsumJob} from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    data: state.dialog.newHashsumJobDialogData,

    isLoading: state.loaders.createHashsumJobLoading,

    emailNotificationsDefault: state.settings.emailNotifications,
    emailAddressDefault: state.settings.emailAddress,
});

const mapDispatchToProps = dispatch => ({
    onClose: () => dispatch(hideNewHashsumJobDialog()),
    onSubmit: data => dispatch(createHashsumJob(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewHashsumJobDialog);
