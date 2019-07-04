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
        const type = this.state.type || this.props.data.type;

        return (
            <div className="container">
                <h5 className="text-primary mb-2">Details</h5>

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
                    label='Name'
                    defaultValue={this.props.data.name}
                    error={this.props.errors.name}
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

                <CloudConnectionField
                    label='Bucket'
                    defaultValue={this.props.data.s3_bucket}
                    error={this.props.errors.s3_bucket}
                />

                <CloudConnectionField
                    label='Region'
                    defaultValue={this.props.data.s3_region}
                    error={this.props.errors.s3_region}
                />

                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                <CloudConnectionField
                    label='access_key_id'
                    defaultValue={this.props.data.s3_access_key_id}
                    error={this.props.errors.s3_access_key_id}
                />

                <CloudConnectionField
                    label='secret_access_key'
                    defaultValue={this.props.data.s3_secret_access_key}
                    error={this.props.errors.s3_secret_access_key}
                />
            </React.Fragment>
        )
    }

    _renderAzureSection() {
        return (
            <React.Fragment>
                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                <CloudConnectionField
                    label='account'
                    defaultValue={this.props.data.azure_account}
                    error={this.props.errors.azure_account}
                />

                <CloudConnectionField
                    label='key'
                    defaultValue={this.props.data.azure_key}
                    error={this.props.errors.azure_key}
                />
            </React.Fragment>
        )
    }

    _renderSwiftSection() {
        return (
            <React.Fragment>
            </React.Fragment>
        )
    }

    _renderGCPSection() {
        return (
            <React.Fragment>
            </React.Fragment>
        )
    }

}

CloudConnectionDialogFields.defaultProps = {
    data: {},
}

CloudConnectionDialogFields.initialState = {
    type: '',
}


class CloudConnectionField extends React.PureComponent {
    render() {
        const { label, defaultValue, error } = this.props;

        return (
            <div className="row form-group">
                <div className="col-4 text-right">
                    <b>{label}</b>
                </div>
                <div className="col-8">
                    <input
                        type="text"
                        className={classnames({
                            'form-control': true,
                            'is-invalid': error,
                        })}
                        name='bucket'
                        defaultValue={defaultValue}
                    />
                    <span className="invalid-feedback">
                        {error}
                    </span>
                </div>
            </div>
        )
    }
}


export default CloudConnectionDialogFields;
