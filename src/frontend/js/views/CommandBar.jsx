import React from 'react';
import {Form} from 'react-bootstrap'

import classnames from 'classnames';


class CommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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
                        <label className="col-2 col-form-label">Cloud</label>
                        <div className="col-10">
                            <input
                                type="text"
                                className="form-control input-sm"
                                value={this.props.host}
                                onChange={()=> {}}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-2 col-form-label">Path</label>
                        <div className="col-10">
                            <input
                                type="text"
                                className="form-control input-sm"
                                value={this.props.path}
                                onChange={()=> {}}
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
}

CommandBar.defaultProps = {
    isLeft: true,
    active: true,
    host: '127.0.0.1',
    path: '/',
    onDisplayCopyJobDialog: () => {},
}

import {connect} from 'react-redux';
import {showCopyJobDialog} from 'actions/dialogActions.jsx'

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onDisplayCopyJobDialog: () => dispatch(showCopyJobDialog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
