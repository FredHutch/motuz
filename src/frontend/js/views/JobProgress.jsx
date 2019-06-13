import React from 'react';
import {ProgressBar, OverlayTrigger, Popover} from 'react-bootstrap';

import ResizableDivider from 'components/ResizableDivider.jsx'

class JobProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = JobProgress.initialState;
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

        const {selectedJob} = this.state;
        console.log(selectedJob)
        const popover = props => {
            console.log(selectedJob.progress)
            return (
                <Popover
                    {...props}
                    id="popover-job-progress"
                    title={`${selectedJob.description} (${selectedJob.id})`}
                    outOfBoundaries={true}
                    show={`${props.show}`}
                >
                    <ProgressBar
                        now={selectedJob.progess}
                        label={`${selectedJob.progress}%`}
                        variant='success'
                    />
                    <button
                        className="btn btn-danger btn-sm btn-block mt-4"
                    >Cancel Job</button>
                </Popover>
            );
        }

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
                        }
                        const item = job[header]
                        return (
                            <OverlayTrigger
                                key={j}
                                trigger="click"
                                placement="top"
                                rootClose
                                rootCloseEvent='mousedown'
                                overlay={popover}
                            >
                                <td> {item} </td>
                            </OverlayTrigger>
                        );
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
        this.setState({selectedJob})
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
}

JobProgress.initialState = {
    selectedJob: {},
}

import {connect} from 'react-redux';
import { listCopyJobs } from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    jobs: state.api.jobs,
});

const mapDispatchToProps = dispatch => ({
    fetchData: () => { dispatch(listCopyJobs()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobProgress);
