import React from 'react';

class JobProgress extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                JobProgress
            </div>
        );
    }

    componentDidMount() {

    }
}

JobProgress.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(JobProgress);
