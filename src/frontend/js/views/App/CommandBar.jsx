import React from 'react';
import classnames from 'classnames';

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

        const cloudLabels = clouds.map(d => ({
            label: `${d.name} (${d.type})`,
            value: d.id,
        }))

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
                                options={cloudLabels}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-2 col-form-label">Path</label>
                        <div className="col-10">
                            <input
                                type="text"
                                className="form-control input-sm"
                                list={`path_box_${this.props.isLeft ? 'left' : 'right'}`}
                                value={this.props.path}
                                onChange={() => {}}
                            />
                            <datalist id={`path_box_${this.props.isLeft ? 'left' : 'right'}`}>
                                <option>/usr/bin</option>
                                <option>/usr/etc</option>
                            </datalist>
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
    onDisplayCopyJobDialog: () => {},
}

import {connect} from 'react-redux';
import {showCopyJobDialog} from 'actions/dialogActions.jsx'
import {hostChange} from 'actions/paneActions.jsx';

const mapStateToProps = state => ({
    clouds: state.api.clouds,
});

const mapDispatchToProps = dispatch => ({
    onDisplayCopyJobDialog: () => dispatch(showCopyJobDialog()),
    onHostChange: (side, host) => dispatch(hostChange(side, host)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
