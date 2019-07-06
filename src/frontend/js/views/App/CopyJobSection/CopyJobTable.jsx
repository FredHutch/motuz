import React from 'react';
import { ProgressBar } from 'react-bootstrap';

import parseTime from 'utils/parseTime.jsx'


class CopyJobTable extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = null;
        this.previousJobsInProgress = new Set()
    }

    render() {
        const headers = [
            'id',
            'description',
            'source',
            'destination',
            'state',
            'time',
            'progress',
        ]

        const tableHeaders = headers.map(header => {
            return (
                <th key={header}>
                    {header}
                </th>
            );
        })


        // TODO: Optimize
        const jobs = this.props.jobs.map(job => {
            const src_cloud_id = job['src_cloud_id']
            if (!src_cloud_id) {
                job['src_cloud'] = 'file'
            } else {
                const src_cloud = this.props.connections.find(d => d.id === src_cloud_id)
                if (src_cloud) {
                    job['src_cloud'] = src_cloud.type
                }
            }

            const dst_cloud_id = job['dst_cloud_id']
            if (!dst_cloud_id) {
                job['dst_cloud'] = 'file'
            } else {
                const dst_cloud = this.props.connections.find(d => d.id === dst_cloud_id)
                if (dst_cloud) {
                    job['dst_cloud'] = dst_cloud.type
                }
            }

            return job
        })

        const tableRows = jobs.map((job, i) => {
            const progress = Math.round(job.progress_current / job.progress_total * 100);

            const source = (
                <React.Fragment>
                    <b>{job.src_cloud}</b>
                    <span>://</span>
                    <span>{job.src_resource}</span>
                </React.Fragment>
            )
            const destination = (
                <React.Fragment>
                    <b>{job.dst_cloud}</b>
                    <span>://</span>
                    <span>{job.dst_path}</span>
                </React.Fragment>
            )

            job = {
                ...job,
                state: job.progress_state,
                time: parseTime(job.progress_execution_time),
                progress,
                source,
                destination,
            }
            return (
                <tr
                    onClick={event => this._onSelectJob(job)}
                    key={job.id}
                >
                    {headers.map((header, j) => {
                        if (header === 'progress') {
                            return (
                                <td key={j}>
                                    <ProgressBar
                                        now={job[header]}
                                        label={`${job[header]}%`}
                                        variant='success'
                                    />
                                </td>
                            )
                        } else {
                            return (
                                <td key={j}>
                                    {job[header]}
                                </td>
                            );
                        }
                    })}
                </tr>
            );
        })

        const currentJobsInProgress = new Set(jobs
            .filter(d => d.progress_state === 'PROGRESS')
            .map(d => d.id)
        )

        let shouldRefreshPanes = false;
        this.previousJobsInProgress.forEach(jobId => {
            if (!currentJobsInProgress.has(jobId)) {
                shouldRefreshPanes = true;
            }
        })
        if (shouldRefreshPanes) {
            this.props.refreshPanes();
        }
        this.previousJobsInProgress = currentJobsInProgress;

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
        this.props.onShowDetails(selectedJob.id);
    }

    _clearTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

CopyJobTable.defaultProps = {
    id: '',
    jobs: [],
    fetchData: () => {},
    refreshPanes: () => {},
    onStopJob: id => {},
    onShowDetails: (jobId) => {},
}

import {connect} from 'react-redux';
import { listCopyJobs, stopCopyJob } from 'actions/apiActions.jsx'
import { showEditCopyJobDialog } from 'actions/dialogActions.jsx';
import { refreshPanes } from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
    jobs: state.api.jobs,
    connections: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    fetchData: () => dispatch(listCopyJobs()),
    refreshPanes: () => dispatch(refreshPanes()),
    onStopJob: id => dispatch(stopCopyJob(id)),
    onShowDetails: (jobId) => dispatch(showEditCopyJobDialog(jobId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyJobTable);