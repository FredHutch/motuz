import React from 'react';
import {Form} from 'react-bootstrap'

import classnames from 'classnames';


class CommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.active)

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
                            <input type="text" className="form-control input-sm" value='localhost' onChange={()=> {}} />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-2 col-form-label">Path</label>
                        <div className="col-10">
                            <input type="text" className="form-control input-sm" value="~" onChange={()=> {}} />
                        </div>
                    </div>
                </div>
                {this.props.isLeft && buttonArrowRight}
            </div>
        );
    }

    componentDidMount() {

    }
}

CommandBar.defaultProps = {
    isLeft: true,
    active: true,
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
