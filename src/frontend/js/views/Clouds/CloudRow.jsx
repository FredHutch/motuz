import React from 'react';

const headers = [
    "id",
    "name",
    "type",
    "bucket",
    "region",
    "access_key_id",
];


class CloudRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const cloud = this.props.data;

        const items = headers.map((header, j) => {
            return (
                <td
                    key={j}
                    onClick={() => this.props.onShowEditConnectionDialog(cloud)}
                >
                    {cloud[header]}
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
    data: {},
    onShowEditConnectionDialog: data => {},
}

import {connect} from 'react-redux';
import {showEditCloudConnectionDialog} from 'actions/dialogActions.jsx';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onShowEditConnectionDialog: () => dispatch(showEditCloudConnectionDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CloudRow);
