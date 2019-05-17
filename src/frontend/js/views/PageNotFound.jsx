import React from 'react';

class PageNotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h1>
            Page Not Found
        </h1>;
    }

    componentDidMount() {

    }
}

PageNotFound.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PageNotFound);
