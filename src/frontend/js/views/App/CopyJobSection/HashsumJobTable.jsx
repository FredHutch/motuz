import React from 'react';
import { ProgressBar } from 'react-bootstrap';

import UriResource from 'components/UriResource.jsx'
import parseTime from 'utils/parseTime.jsx'


class HashsumJobTable extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = null;
        this.previousJobsInProgress = new Set()
    }

    render() {
        const headers = [
            'id',
            'source',
            'destination',
            'time',
            'progress',
        ]

        const headerNames = {
            'id': 'ID',
            'source': 'Compare',
            'destination': 'With',
            'time': 'Time',
            'progress': 'Progress',
        }

        const tableHeaders = headers.map(header => {
            return (
                <th key={header}>
                    {headerNames[header]}
                </th>
            );
        })

        const cloudMapping = {
            0: {
                type: 'file',
            }
        }

        this.props.connections.forEach(connection => {
            cloudMapping[connection.id] = connection
        })

        const tableRows = this.props.jobs.map((job, i) => {
            const progressValue = Math.round(job.progress_current / job.progress_total * 100);

            const src_cloud_id = job['src_cloud_id'] || 0
            const src_cloud = cloudMapping[src_cloud_id]

            if (src_cloud == undefined) {
                job.src_cloud_type = "(unknown)"
            } else {
                job.src_cloud_type = src_cloud.type;
            }

            const dst_cloud_id = job['dst_cloud_id'] || 0
            const dst_cloud = cloudMapping[dst_cloud_id]

            if (dst_cloud == undefined) {
                job.dst_cloud_type = "(unknown)"
            } else {
                job.dst_cloud_type = dst_cloud.type;
            }

            let color = 'default';
            if (job.progress_state === 'SUCCESS') {
                color = 'success'
            } else if (job.progress_state === 'FAILED' || job.progress_state === 'STOPPED') {
                color = 'danger'
            } else if (job.progress_state === 'PROGRESS') {
                color = 'primary'
            }

            const source = (
                <UriResource protocol={job.src_cloud_type} path={job.src_resource_path} />
            )
            const destination = (
                <UriResource protocol={job.dst_cloud_type} path={job.dst_resource_path} />
            )
            const progress = (
                <ProgressBar
                    now={progressValue}
                    label={`${progressValue}%`}
                    variant={color}
                />
            )

            const jobFields = {
                ...job,
                time: parseTime(job.progress_execution_time),
                source,
                destination,
                progress,
            }

            return (
                <tr
                    onClick={event => this._onSelectJob(job)}
                    key={job.id}
                >
                    {headers.map((header, j) => (
                        <td key={j} className='align-middle'>
                            {jobFields[header]}
                        </td>
                    ))}
                </tr>
            );
        })

        const currentJobsInProgress = new Set(this.props.jobs
            .filter(d => d.progress_state === 'PROGRESS')
            .map(d => d.id)
        )

        if (currentJobsInProgress.size > 0) {
            this.scheduleRefresh(currentJobsInProgress);
        }

        return (
            <table className='table table-sm table-striped table-hover text-left'>
                <thead>
                    <tr>{tableHeaders}</tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        );
    }

    componentDidMount() {
        this.props.fetchData();
    }

    componentWillUnmount() {
        this._clearTimeout();
    }

    scheduleRefresh(currentJobsInProgress) {
        const refreshDelay = 1000; // 1s
        this._clearTimeout();
        this.timeout = setTimeout(() => {
            this.props.fetchData();
        }, refreshDelay)
    }

    _onSelectJob(selectedJob) {
        this.props.onShowDetails(selectedJob);
    }

    _clearTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

HashsumJobTable.defaultProps = {
    id: '',
    jobs: [],
    connections: [],
    fetchData: () => {},
    onShowDetails: (hashsumJob) => {},
}

import {connect} from 'react-redux';
import { listHashsumJobs, stopHashsumJob } from 'actions/apiActions.jsx'
import { showEditHashsumJobDialog } from 'actions/dialogActions.jsx';

const mapStateToProps = state => ({
    jobs: state.api.hashsumJobs,
    connections: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    fetchData: () => dispatch(listHashsumJobs()),
    onShowDetails: (hashsumJob) => dispatch(showEditHashsumJobDialog(hashsumJob)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HashsumJobTable);
