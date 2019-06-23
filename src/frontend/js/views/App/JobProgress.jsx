import React from 'react';
import {ProgressBar, OverlayTrigger, Popover} from 'react-bootstrap';

import ResizableDivider from 'components/ResizableDivider.jsx'

class JobProgress extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.timeout = null;
    }

    render() {
        const headers = [
            'id',
            'description',
            'src_cloud',
            'src_resource',
            'dst_cloud',
            'dst_path',
            'state',
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
            const progress = Math.round(job.progress_current / job.progress_total * 100);

            job = {
                ...job,
                'state': job.progress_state,
                'progress': progress,
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

        const shouldRefresh = this.props.jobs.some(d => d.progress_state === 'PROGRESS');
        if (shouldRefresh) {
            this.scheduleRefresh();
        }

        return (
            <div
                id={this.props.id}
                ref={this.container}
                style={{position: 'relative'}}
            >
                <ResizableDivider
                    onResize={event => this.onResize(event)}
                />
                <table className='table table-sm table-striped table-hover text-center'>
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
        this.props.fetchData();
    }

    componentWillUnmount() {
        this._clearTimeout();
    }

    scheduleRefresh() {
        const refreshDelay = 1000; // 1s
        this._clearTimeout();
        this.timeout = setTimeout(() => {
            this.props.fetchData();
        }, refreshDelay)
    }

    onResize(event) {
        const container = this.container.current

        const newTop = event.pageY;
        const oldTop = container.offsetTop;

        const oldHeight = container.offsetHeight;
        const newHeight = oldHeight + oldTop - newTop;

        container.style.height = `${newHeight}px`
    }

    _onSelectJob(selectedJob) {
        console.log(selectedJob)
        this.props.onShowDetails(selectedJob);
    }

    _onDeselectJob() {
        this.setState({showPopover: false})
    }

    _clearTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}

JobProgress.defaultProps = {
    id: '',
    jobs: [],
    fetchData: () => {},
    onStopJob: id => {},
    onShowDetails: (selectedJob) => {},
}

import {connect} from 'react-redux';
import { listCopyJobs, stopCopyJob } from 'actions/apiActions.jsx'
import { showCopyJobEditDialog } from 'actions/dialogActions.jsx';

const mapStateToProps = state => ({
    jobs: state.api.jobs,
});

const mapDispatchToProps = dispatch => ({
    fetchData: () => dispatch(listCopyJobs()),
    onStopJob: id => dispatch(stopCopyJob(id)),
    onShowDetails: (selectedJob) => dispatch(showCopyJobEditDialog(selectedJob)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JobProgress);
