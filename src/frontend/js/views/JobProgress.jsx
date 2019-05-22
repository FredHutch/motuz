import React from 'react';

import ResizableDivider from 'components/ResizableDivider.jsx'
import formatDate from 'utils/formatDate.jsx'

class JobProgress extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
    }

    render() {
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
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
    jobs: state.api.jobs,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(JobProgress);
