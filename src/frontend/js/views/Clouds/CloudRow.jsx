import React from 'react';

const headers = [
    "id",
    "name",
    "type",
    "bucket",
    "access_key_id",
];


class CloudRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { data } = this.props;

        const headers = [
            "id",
            "name",
            "type",
            "bucket",
        ]
        if (data.type === "s3") {
            headers.push("s3_access_key_id")
        } else if (data.type === "azureblob") {
            headers.push("azure_account")
        } else if (data.type === "swift") {
            headers.push("swift_user")
        } else if (data.type === "google cloud storage") {
            headers.push("gcp_client_id")
        } else if (data.type === "sftp") {
            headers.push("sftp_user")
        } else if (data.type === "dropbox") {
            headers.push("") // We do not have an ID here
        } else if (data.type === "onedrive") {
            headers.push("onedrive_drive_id")
        } else if (data.type === "webdav") {
            headers.push("webdav_user")
        } else {
            console.error(`Unknown Connection Type ${data.type}`)
        }

        const items = headers.map((header, j) => {
            return (
                <td
                    key={j}
                    onClick={() => this.props.onShowEditConnectionDialog(data)}
                >
                    {data[header]}
                </td>
            );
        })

        return (
            <tr>
                {items}
            </tr>
        );
    }
}

CloudRow.defaultProps = {
    // data: {},
    onShowEditConnectionDialog: data => {},
}

import {connect} from 'react-redux';
import {showEditCloudConnectionDialog} from 'actions/dialogActions.jsx';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onShowEditConnectionDialog: data => dispatch(showEditCloudConnectionDialog(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CloudRow);
