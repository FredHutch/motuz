import React from 'react';

import Navbar from 'components/Navbar.jsx'
import CloudRow from 'views/Clouds/CloudRow.jsx'

const headers = [
    "id",
    "name",
    "type",
    "bucket",
    "username",
];


class Clouds extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Navbar brandIsBackArrow={true}/>
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-12">
                            <button
                                className="btn btn-success"
                                onClick={(event) => this.props.onShowNewConnectionDialog()}
                            >
                                New Connection
                            </button>
                        </div>
                        <div className="col-12 mt-4">
                            <table className="table text-center table-hover">
                                <thead>
                                    <tr>
                                        {headers.map(header => <th key={header}>{header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.clouds.map(cloud =>
                                        <CloudRow key={cloud.id} data={cloud} />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.props.onMount();
    }
}

Clouds.defaultProps = {
    clouds: [],
    onMount: () => {},
    onShowEditConnectionDialog: data => {},
    onShowNewConnectionDialog: () => {},
}

import {connect} from 'react-redux';
import {showNewCloudConnectionDialog, showEditCloudConnectionDialog} from 'actions/dialogActions.jsx';
import {listCloudConnections} from 'actions/apiActions.jsx';

const mapStateToProps = state => ({
    clouds: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    onMount: () => dispatch(listCloudConnections()),
    onShowNewConnectionDialog: () => dispatch(showNewCloudConnectionDialog()),
    onShowEditConnectionDialog: (data) => dispatch(showEditCloudConnectionDialog(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Clouds);
