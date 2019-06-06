import React from 'react';

import Navbar from 'components/Navbar.jsx'

class PageNotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Navbar />
                <h1> Page Not Found </h1>
            </React.Fragment>
        );
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
