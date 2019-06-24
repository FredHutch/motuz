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
        value: 'azure',
    },
    {
        label: 'Google Cloud Bucket',
        value: 'google',
    },
]


class CloudConnectionDialogFields extends React.PureComponent {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
    }

    render() {
        const { data, errors } = this.props;

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
                            defaultValue={data.type}
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

                <div className="row form-group">
                    <div className="col-4 text-right">
                        <b>Name</b>
                    </div>
                    <div className="col-8">
                        <input
                            type="text"
                            className={classnames({
                                'form-control': true,
                                'is-invalid': errors.name,
                            })}
                            name='name'
                            defaultValue={data.name}
                        />
                        <span className="invalid-feedback">
                            {errors.name}
                        </span>
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-4 text-right">
                        <b>Bucket</b>
                    </div>
                    <div className="col-8">
                        <input
                            type="text"
                            className={classnames({
                                'form-control': true,
                                'is-invalid': errors.bucket,
                            })}
                            name='bucket'
                            defaultValue={data.bucket}
                        />
                        <span className="invalid-feedback">
                            {errors.bucket}
                        </span>
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-4 text-right">
                        <b>Region</b>
                    </div>
                    <div className="col-8">
                        <input
                            type="text"
                            className={classnames({
                                'form-control': true,
                                'is-invalid': errors.region,
                            })}
                            name='region'
                            defaultValue={data.region}
                        />
                        <span className="invalid-feedback">
                            {errors.region}
                        </span>
                    </div>
                </div>


                <h5 className='text-primary mt-5 mb-2'>Credentials</h5>

                <div className="row form-group">
                    <div className="col-4 text-right">
                        <b>access_key_id</b>
                    </div>
                    <div className="col-8">
                        <input
                            type="text"
                            className={classnames({
                                'form-control': true,
                                'is-invalid': errors.access_key_id,
                            })}
                            name='access_key_id'
                            defaultValue={data.access_key_id}
                        />
                        <span className="invalid-feedback">
                            {errors.access_key_id}
                        </span>
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-4 text-right">
                        <b>access_key_secret</b>
                    </div>
                    <div className="col-8">
                        <input
                            type="text"
                            className={classnames({
                                'form-control': true,
                                'is-invalid': errors.access_key_secret,
                            })}
                            name='access_key_secret'
                            defaultValue={data.access_key_secret}
                        />
                        <span className="invalid-feedback">
                            {errors.access_key_secret}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {

    }
}

CloudConnectionDialogFields.defaultProps = {
    data: {},
}

export default CloudConnectionDialogFields;
