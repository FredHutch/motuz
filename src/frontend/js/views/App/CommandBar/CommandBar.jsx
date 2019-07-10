import React from 'react';
import classnames from 'classnames';
import Creatable from 'react-select/creatable';
import upath from 'upath';

import Select from 'components/Select.jsx';
import constants from 'constants.jsx'


const LOCALHOST = {
    id: 0,
    name: constants.local_name,
    type: 'file',
}


class CommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const clouds = [
            LOCALHOST,
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
                recentPaths.add(job.dst_resource_path)
            }
            if ((job.src_cloud_id || 0) === currCloud) {
                recentPaths.add(upath.join(job.src_resource_path, '..'))
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
                    onClick={() => this.displayNewCopyJobDialog()}
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
                    onClick={() => this.displayNewCopyJobDialog()}
                > <b> &gt; </b> </button>
            </div>
        );

        return (
            <div className='row' onClick={() => this.onClick()}>
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

    displayNewCopyJobDialog() {
        this.props.onDisplayNewCopyJobDialog()
    }

    onClick() {
        if (!this.props.active) {
            this.props.onClick(this.props.isLeft ? 'left' : 'right')
        }
    }

    onHostChange(hostId) {
        hostId = parseInt(hostId)

        const clouds = [
            LOCALHOST,
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
    focusPaneLeft: false,
    host: {
        name: '',
        type: '',
    },
    path: '/',
    clouds: [],
    onHostChange: (side, host) => {},
    onDirectoryChange: (side, path) => {},
    onDisplayNewCopyJobDialog: () => {},
    onClick: side => {},
}

import {connect} from 'react-redux';
import {showNewCopyJobDialog} from 'actions/dialogActions.jsx'
import {hostChange, directoryChange, sideFocus} from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
    jobs: state.api.jobs,
    clouds: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    onDisplayNewCopyJobDialog: () => dispatch(showNewCopyJobDialog()),
    onHostChange: (side, host) => dispatch(hostChange(side, host)),
    onDirectoryChange: (side, path) => dispatch(directoryChange(side, path)),
    onClick: side => dispatch(sideFocus(side)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
