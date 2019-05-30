import React from 'react';
import {ProgressBar} from 'react-bootstrap';

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
            const progress = Math.round(job.progress.current / job.progress.total * 100);

            job = {
                ...job,
                'state': job.progress.state,
                'progress': progress,
            }
            return (
                <tr key={i}>
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
                            <td key={j}>
                                {item}
                            </td>
                        );
                    })}
                </tr>
            );
        })

        const shouldRefresh = this.props.jobs.some(d => d.progress.state === 'PROGRESS');
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

import {connect} from 'react-redux';
import { listCopyJobs } from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    jobs: state.api.jobs,
});

const mapDispatchToProps = dispatch => ({
    fetchData: () => { dispatch(listCopyJobs()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobProgress);
