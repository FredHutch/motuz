import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import classnames from 'classnames';

const CONNECTION_TYPES = [
    {
        label: 'Amazon Simple Storage Service (s3)',
        value: 's3',
    },
    {
        label: 'Azure Blob Storage',
        value: 'azureblob',
    },
    {
        label: 'Google Cloud Bucket',
        value: 'google cloud storage',
    },
    {
        label: 'Swift',
        value: 'swift',
    },
]

class CloudConnectionDialogFields extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = CloudConnectionDialogFields.initialState;
    }

    render() {
        const { data, errors } = this.props;
        const type = this.state.type || this.props.data.type || 's3';

        return (
            <div className="container">
                <h5 className="text-primary mb-2">Basic</h5>

                <input type="hidden" name='id' value={data.id}/>

                <div className="row form-group">
                    <div className="col-4 text-right">
                        <b>Type</b>
                    </div>
                    <div className="col-8">
                        <select
                            className="form-control"
                            name="type"
                            value={type}
                            onChange={(event => this.setState({type: event.target.value}))}
                        >
                            {CONNECTION_TYPES.map(d => (
                                <option
                                    key={d.value}
                                    value={d.value}
                                >{d.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <CloudConnectionField
                    label='Connection Name'
                    input={{
                        name: 'name',
                        defaultValue: this.props.data.name,
                        required: true,
                    }}
                    error={this.props.errors.name}
                    is_valid={this.props.verifySuccess}
                />

                <CloudConnectionField
                    label='Bucket Name'
                    input={{
                        name: 'bucket',
                        defaultValue: this.props.data.s3_bucket,
                        required: true,
                    }}
                    error={this.props.errors.s3_bucket}
                    is_valid={this.props.verifySuccess}
                />

                {type === 's3' && this._renderS3Section()}
                {type === 'azureblob' && this._renderAzureSection()}
                {type === 'swift' && this._renderSwiftSection()}
                {type === 'google cloud storage' && this._renderGCPSection()}
            </div>
        );
    }

    componentDidMount() {

    }

    _renderS3Section() {
        return (
            <React.Fragment>
                <h5 className='text-primary mt-5 mb-2'>Details</h5>

                <CloudConnectionField
                    label='Region'
                    input={{
                        name: 's3_region',
                        defaultValue: this.props.data.s3_region,
                    }}
                    error={this.props.errors.s3_region}
                    is_valid={this.props.verifySuccess}
                />

                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                <CloudConnectionField
                    label='access_key_id'
                    input={{
                        name: 's3_access_key_id',
                        defaultValue: this.props.data.s3_access_key_id,
                        required: true,
                    }}
                    error={this.props.errors.s3_access_key_id}
                    is_valid={this.props.verifySuccess}
                />

                <CloudConnectionField
                    label='secret_access_key'
                    input={{
                        name: 's3_secret_access_key',
                        defaultValue: this.props.data.s3_secret_access_key,
                        required: true,
                    }}
                    error={this.props.errors.s3_secret_access_key}
                    is_valid={this.props.verifySuccess}
                />

                <details>
                    <summary className='text-primary h5 mt-5 mb-2'>
                        S3 Compatible Storage
                    </summary>

                    <CloudConnectionField
                        label='Endpoint URL'
                        input={{
                            name: 's3_endpoint',
                            defaultValue: this.props.data.s3_endpoint,
                        }}
                        error={this.props.errors.s3_endpoint}
                        is_valid={this.props.verifySuccess}
                    />
                </details>



            </React.Fragment>
        )
    }

    _renderAzureSection() {
        return (
            <React.Fragment>
                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                <CloudConnectionField
                    label='Account'
                    input={{
                        name: 'azure_account',
                        defaultValue: this.props.data.azure_account,
                        required: true,
                    }}
                    error={this.props.errors.azure_account}
                    is_valid={this.props.verifySuccess}
                />

                <CloudConnectionField
                    label='Key'
                    input={{
                        name: 'azure_key',
                        defaultValue: this.props.data.azure_key,
                        required: true,
                    }}
                    error={this.props.errors.azure_key}
                    is_valid={this.props.verifySuccess}
                />
            </React.Fragment>
        )
    }

    _renderSwiftSection() {
        return (
            <React.Fragment>
                <h5 className='text-primary mt-5 mb-2'>Details</h5>

                <CloudConnectionField
                    label='Auth URL'
                    input={{
                        name: 'swift_auth',
                        defaultValue: this.props.data.swift_auth,
                    }}
                    error={this.props.errors.swift_auth}
                    is_valid={this.props.verifySuccess}
                />

                <CloudConnectionField
                    label='Tenant'
                    input={{
                        name: 'swift_tenant',
                        defaultValue: this.props.data.swift_tenant,
                    }}
                    error={this.props.errors.swift_tenant}
                    is_valid={this.props.verifySuccess}
                />

                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                <CloudConnectionField
                    label='User'
                    input={{
                        name: 'swift_user',
                        defaultValue: this.props.data.swift_user,
                        required: true,
                    }}
                    error={this.props.errors.swift_user}
                    is_valid={this.props.verifySuccess}
                />

                <CloudConnectionField
                    label='Password / Key'
                    input={{
                        name: 'swift_key',
                        defaultValue: this.props.data.swift_key,
                        required: true,
                    }}
                    error={this.props.errors.swift_key}
                    is_valid={this.props.verifySuccess}
                />
            </React.Fragment>
        )
    }

    _renderGCPSection() {
        return (
            <React.Fragment>
                <h5 className='text-primary mt-5 mb-2'>Details</h5>

                <CloudConnectionField
                    label='Project Number'
                    input={{
                        name: 'gcp_project_number',
                        defaultValue: this.props.data.gcp_project_number,
                    }}
                    error={this.props.errors.gcp_project_number}
                    is_valid={this.props.verifySuccess}
                />

                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                <CloudConnectionField
                    label='Client ID'
                    input={{
                        name: 'gcp_client_id',
                        defaultValue: this.props.data.gcp_client_id,
                        required: true,
                    }}
                    error={this.props.errors.gcp_client_id}
                    is_valid={this.props.verifySuccess}
                />

                <CloudConnectionField
                    label='Service Account Credentials (JSON)'
                    input={{
                        name: 'gcp_service_account_credentials',
                        defaultValue: this.props.data.gcp_service_account_credentials,
                        required: true,
                    }}
                    error={this.props.errors.gcp_service_account_credentials}
                    is_valid={this.props.verifySuccess}
                />

                <input
                    type="hidden"
                    name='gcp_object_acl'
                    value='private'
                />

                <input
                    type="hidden"
                    name='gcp_bucket_acl'
                    value='private'
                />
            </React.Fragment>
        )
    }

}

CloudConnectionDialogFields.defaultProps = {
    verifySuccess: false,
    data: {},
}

CloudConnectionDialogFields.initialState = {
    type: '',
}


class CloudConnectionField extends React.PureComponent {
    render() {
        const {
            label,
            input,
            error,
            is_valid,
        } = this.props;

        return (
            <div className="row form-group">
                <div className="col-4 text-right">
                    <b>{label}</b>
                </div>
                <div className="col-8">
                    {this.props.children || (
                        <input
                            {...this.props.input}
                            type="text"
                            className={classnames({
                                'form-control': true,
                                'is-valid': is_valid,
                                'is-invalid': error,
                            })}
                            autoComplete='off'
                        />
                    )}
                    <span className="invalid-feedback">
                        {error}
                    </span>
                </div>
            </div>
        )
    }
}


export default CloudConnectionDialogFields;
