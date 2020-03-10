import React from 'react';
import classnames from 'classnames';
import Creatable from 'react-select/creatable';
import Select from 'react-select';
import upath from 'upath';

import Icon from 'components/Icon.jsx';
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
        const side = this.props.isLeft ? 'left' : 'right'
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
                recentPaths.add(upath.join(job.dst_resource_path, '..'))
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
            <div className="col-2 middle" style={{justifyContent: "flex-start"}}>
                <button
                    className={classnames({
                        'btn': true,
                        'btn-primary': this.props.active,
                        'btn-secondary': !this.props.active,
                        'btn-lg': true,
                    })}
                    disabled={!this.props.active}
                    onClick={() => this.props.onShowNewCopyJobDialog()}
                > <b> &lt; </b> </button>
            </div>
        )

        const buttonArrowRight = (
            <div className="col-2 middle" style={{justifyContent: "flex-end"}}>
                <button
                    className={classnames({
                        'btn': true,
                        'btn-primary': this.props.active,
                        'btn-secondary': !this.props.active,
                        'btn-lg': true,
                    })}
                    disabled={!this.props.active}
                    onClick={() => this.props.onShowNewCopyJobDialog()}
                > <b> &gt; </b> </button>
            </div>
        );

        const formatOptionLabel = (data, {context}) => {
            return (
                <React.Fragment>
                    {context === 'menu' && !data.__isNew__ && <Icon name="history" />} {data.label}
                </React.Fragment>
            )
        }

        return (
            <div onClick={() => this.onClick()}>
                <div className='row'>
                    {!this.props.isLeft && buttonArrowLeft}
                    <div className="col-10">
                        <div className="row mb-1">
                            <label className="col-2 col-form-label">Host</label>
                            <div className="col-10">
                                <Select
                                    value={{value: this.props.host.id, label: this.props.host.name}}
                                    onChange={(option)=> this.onHostChange(option.value)}
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
                                    value={{label: this.props.path, value: this.props.path}}

                                    openMenuOnClick={false}
                                    openMenuOnFocus={false}
                                    blurInputOnSelect={true}
                                    isValidNewOption={(value) => value}
                                    createOptionPosition='first'
                                    filterOption={(option, inputValue) => inputValue === "" || option.data.__isNew__}

                                    formatCreateLabel={(inputValue) => `Go to ${inputValue}`}
                                    formatOptionLabel={formatOptionLabel}
                                    noOptionsMessage={(inputValue) => null}
                                />
                            </div>
                        </div>
                    </div>
                    {this.props.isLeft && buttonArrowRight}
                </div>
                <div className="row">
                    <div className="col-12">
                        <button
                            className="btn btn-link px-0 ml-0 mr-2 my-0"
                            onClick={event => this.props.onShowMkdirDialog(side)}
                            alt='Press to create folder'
                            title='Press to create folder'
                            aria-label='Press to create folder'
                        >
                            <Icon name='file-submodule' className='mr-2'/>
                            <span>Create Folder</span>
                        </button>
                        <button
                            className="btn btn-link px-0 mx-2 my-0"
                            onClick={event => this.props.onRefresh(side)}
                            alt='Press to refresh panes'
                            title='Press to refresh panes'
                            aria-label='Press to refresh panes'
                        >
                            <Icon name='sync' className='mr-2'/>
                            <span>Refresh Window</span>
                        </button>
                    </div>
                </div>
            </div>
        );
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
    onShowNewCopyJobDialog: () => {},
    onShowMkdirDialog: (side) => {},
    onRefresh: (side) => {},
    onClick: side => {},
}

import {connect} from 'react-redux';
import {showNewCopyJobDialog, showMkdirDialog} from 'actions/dialogActions.jsx'
import {hostChange, directoryChange, sideFocus, refreshPane} from 'actions/paneActions.jsx';


const mapStateToProps = state => ({
    jobs: state.api.jobs,
    clouds: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    onHostChange: (side, host) => dispatch(hostChange(side, host)),
    onDirectoryChange: (side, path) => dispatch(directoryChange(side, path)),
    onShowNewCopyJobDialog: () => dispatch(showNewCopyJobDialog()),
    onShowMkdirDialog: (side) => dispatch(showMkdirDialog(side)),
    onRefresh: (side) => dispatch(refreshPane(side)),
    onClick: side => dispatch(sideFocus(side)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
