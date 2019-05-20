import React from 'react';

import formatDate from 'utils/formatDate.jsx'

class JobProgress extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.jobs)

        const headers = [
            'id',
            'description',
            'start_time',
            'finish_time',
            // 'from_uri',
            // 'to_uri',
            'status',
            'progress',

        ]

        const tableHeaders = headers.map((header, j) => {
            return (
                <th key={j}>
                    {header}
                </th>
            );
        })

        const tableRows = this.props.jobs.map((job, i) => {
            job = {
                ...job,
                'start_time': formatDate(job['start_time']),
                'finish_time': formatDate(job['finish_time']),
                'progress': `${job['progress']}%`,
            }
            return (
                <tr key={i}>
                    {headers.map((header, j) => {
                        const item = job[header]
                        return (
                            <td key={j}>
                                {item}
                            </td>
                        );
                    })}
                </tr>
            );
        })

        return (
            <div>
                <table className='table table-sm table-striped text-center'>
                    <thead>
                        <tr>{tableHeaders}</tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {

    }
}

JobProgress.defaultProps = {
    jobs: [],
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    jobs: state.copyJob.jobs,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(JobProgress);
