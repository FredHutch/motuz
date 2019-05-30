import React from 'react';
import {ProgressBar} from 'react-bootstrap';

import ResizableDivider from 'components/ResizableDivider.jsx'

class JobProgress extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
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
        this.props.onMount();
    }

    onResize(event) {
        const container = this.container.current

        const newTop = event.pageY;
        const oldTop = container.offsetTop;

        const oldHeight = container.offsetHeight;
        const newHeight = oldHeight + oldTop - newTop;

        container.style.height = `${newHeight}px`
    }
}

JobProgress.defaultProps = {
    id: '',
    jobs: [],
    onMount: () => {},
}

import {connect} from 'react-redux';
import { listCopyJobs } from 'actions/apiActions.jsx'

const mapStateToProps = state => ({
    jobs: state.api.jobs,
});

const mapDispatchToProps = dispatch => ({
    onMount: () => { dispatch(listCopyJobs()) }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobProgress);
