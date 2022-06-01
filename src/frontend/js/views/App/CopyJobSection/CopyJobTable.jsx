import React from 'react';
import {Pagination, ProgressBar, Table} from 'react-bootstrap';

import UriResource from 'components/UriResource.jsx'
import parseTime from 'utils/parseTime.jsx'


class CopyJobTable extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = null;
        this.previousJobsInProgress = new Set();
        this.page = 1;
    }

    render() {
        const headers = [
            'id',
            'description',
            'source',
            'destination',
            'time',
            'state',
            'progress',
        ]

        const headerNames = {
            'id': 'ID',
            'description': 'Description',
            'source': 'Source',
            'destination': 'Destination',
            'time': 'Time',
            'state': 'State',
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

        const tableRows = this.props.jobs.data.map((job, i) => {
            const progressValue = Math.round(job.progress_current / job.progress_total * 100);

            const src_cloud_id = job['src_cloud_id'] || 0
            const src_cloud = cloudMapping[src_cloud_id]

            const dst_cloud_id = job['dst_cloud_id'] || 0
            const dst_cloud = cloudMapping[dst_cloud_id]

            if (src_cloud == undefined) {
                job.src_cloud_type = "(unknown)"
            } else {
                job.src_cloud_type = src_cloud.type;
            }

            if (dst_cloud == undefined) {
                job.dst_cloud_type = "(unknown)";
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

            const state = (
                <b className={`text-${color}`}>
                    {job.progress_state}
                </b>
            )
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
                state,
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

        const currentJobsInProgress = new Set(this.props.jobs.data
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

        const pageItems = [];
        for (const page of this.props.jobs.pages) {
            pageItems.push(
                <Pagination.Item
                    key={page}
                    active={page === this.props.page}
                    onClick={() => this.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )
        }


        return (
            <>
                <Table striped hover size="sm" className='text-left'>
                    <thead>
                    <tr>{tableHeaders}</tr>
                    </thead>
                    <tbody>
                    {tableRows}
                    </tbody>
                </Table>
                <Pagination size="sm">{pageItems}</Pagination>
            </>
        );
    }

    componentDidMount() {
        this.props.fetchData(this.props.page);
    }

    componentWillUnmount() {
        this._clearTimeout();
    }

    scheduleRefresh(currentJobsInProgress) {
        const refreshDelay = 1000; // 1s
        this._clearTimeout();
        this.timeout = setTimeout(() => {
            this.props.fetchData(this.props.page);
        }, refreshDelay)
    }

    setPage(page) {
        this.props.page(page);
        this.props.fetchData(this.props.page);
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

CopyJobTable.defaultProps = {
    id: '',
    page: 1,
    jobs: [],
    connections: [],
    fetchData: (page) => {},
    refreshPanes: () => {},
    onShowDetails: (copyJob) => {},
}

import {connect} from 'react-redux';
import { listCopyJobs } from 'actions/apiActions.jsx'
import { showEditCopyJobDialog } from 'actions/dialogActions.jsx';
import { refreshPanes } from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
    jobs: state.api.jobs,
    connections: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    fetchData: (page) => dispatch(listCopyJobs(page)),
    refreshPanes: () => dispatch(refreshPanes()),
    onShowDetails: (copyJob) => dispatch(showEditCopyJobDialog(copyJob)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CopyJobTable);
