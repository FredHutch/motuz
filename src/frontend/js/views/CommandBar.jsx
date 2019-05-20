import React from 'react';
import {Form} from 'react-bootstrap'


class CommandBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Host</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control input-sm" value='localhost' onChange={()=> {}} />
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-2 col-form-label">Path</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control input-sm" value="~" onChange={()=> {}} />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {

    }
}

CommandBar.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CommandBar);
