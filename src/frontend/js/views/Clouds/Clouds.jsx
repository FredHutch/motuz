import React from 'react';


const headers = [
    "id",
    "type",
    "name",
    "bucket",
    "region",
    "key_id",
    "key_secret",
];


class Clouds extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const connectionRows = this.props.clouds.map((cloud, i) => {
            items = headers.map((header, j) => {
                <td key={j}>
                    {header}
                </td>
            })


            return (
                <tr key={cloud.id}>
                    {items}
                </tr>
            );
        })



        return (
            <div className="container-fluid mt-4">
                <div className="row">
                    <div className="col-12">
                        <button className="btn btn-success" onClick={(event) => this.props.onNewConnection()}>
                            New Connection
                        </button>
                    </div>
                    <div className="col-12 mt-4">
                        <table className="table">
                            <thead>
                                <tr>
                                    {headers.map(header => <th key={header}>{header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {connectionRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {

    }
}

Clouds.defaultProps = {
    clouds: [],
    onNewConnection: () => {},
}

import {connect} from 'react-redux';
import {showCloudConnectionDialog} from 'actions/dialogActions.jsx';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onNewConnection: () => dispatch(showCloudConnectionDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Clouds);
