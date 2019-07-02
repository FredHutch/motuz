import React from 'react';
import classnames from 'classnames';
import Creatable from 'react-select/creatable';
import upath from 'upath';


import Select from 'components/Select.jsx';


class CommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const clouds = [
            {
                id: 0,
                name: 'localhost',
                type: 'file',
            },
            ...this.props.clouds
        ];

        const cloudOptions = clouds.map(d => ({
            label: `${d.name} (${d.type})`,
            value: d.id,
        }))

        const currCloud = this.props.host.id;
        const recentPaths = new Set()
        for (let job of this.props.jobs) {
            if ((job.dst_cloud_id || 0) === currCloud) {
                recentPaths.add(job.dst_path)
            }
            if ((job.src_cloud_id || 0) === currCloud) {
                recentPaths.add(upath.join(job.src_resource, '..'))
            }
            if (recentPaths.size > 10) {
                break;
            }
        }

        const pathOptions = [...recentPaths].map(d => ({value: d, label: d}))

        const buttonArrowLeft = (
            <div className="col-2 middle">
                <button
                    className={classnames({
                        'btn': true,
                        'btn-primary': this.props.active,
                        'btn-secondary': !this.props.active,
                        'btn-lg': true,
                    })}
                    disabled={!this.props.active}
                    onClick={() => this.displayCopyJobDialog()}
                > <b> &lt; </b> </button>
            </div>
        )

        const buttonArrowRight = (
            <div className="col-2 middle">
                <button
                    className={classnames({
                        'btn': true,
                        'btn-primary': this.props.active,
                        'btn-secondary': !this.props.active,
                        'btn-lg': true,
                    })}
                    disabled={!this.props.active}
                    onClick={() => this.displayCopyJobDialog()}
                > <b> &gt; </b> </button>
            </div>
        );

        return (
            <div className='row'>
                {!this.props.isLeft && buttonArrowLeft}
                <div className="col-10">
                    <div className="row mb-1">
                        <label className="col-2 col-form-label">Host</label>
                        <div className="col-10">
                            <Select
                                className="form-control input-sm"
                                value={this.props.host.id}
                                onChange={(event)=> this.onHostChange(event.target.value)}
                                options={cloudOptions}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-2 col-form-label">Path</label>
                        <div className="col-10">
                            <Creatable
                                options={pathOptions}
                                onChange={(event) => this.onDirectoryChange(event)}
                                formatCreateLabel={(inputValue) => `Go to "${inputValue}"`}
                                noOptionsMessage={(inputValue) => null}
                                value={{label: this.props.path, value: this.props.path}}
                            />
                        </div>
                    </div>
                </div>
                {this.props.isLeft && buttonArrowRight}
            </div>
        );
    }

    componentDidMount() {

    }

    displayCopyJobDialog() {
        this.props.onDisplayCopyJobDialog()
    }

    onHostChange(hostId) {
        hostId = parseInt(hostId)

        // TODO: Add this to the database
        const clouds = [
            {
                id: 0,
                name: '127.0.0.1',
                type: 'localhost',
            },
            ...this.props.clouds
        ];

        const host = clouds.find(d => d.id === hostId)
        this.props.onHostChange(this.props.isLeft ? 'left' : 'right', host)
    }

    onDirectoryChange(option) {
        const {value} = option;
        this.props.onDirectoryChange(this.props.isLeft ? 'left' : 'right', value);
    }
}

CommandBar.defaultProps = {
    isLeft: true,
    active: true,
    host: {
        name: '127.0.0.1',
        type: 'localhost',
    },
    path: '/',
    clouds: [],
    onHostChange: (side, host) => {},
    onDirectoryChange: (side, path) => {},
    onDisplayCopyJobDialog: () => {},
}

import {connect} from 'react-redux';
import {showCopyJobDialog} from 'actions/dialogActions.jsx'
import {hostChange, directoryChange} from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
    jobs: state.api.jobs,
    clouds: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    onDisplayCopyJobDialog: () => dispatch(showCopyJobDialog()),
    onHostChange: (side, host) => dispatch(hostChange(side, host)),
    onDirectoryChange: (side, path) => dispatch(directoryChange(side, path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
