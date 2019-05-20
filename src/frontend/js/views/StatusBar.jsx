import React from 'react';

class StatusBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                &copy; Fred Hutchinson Cancer Research Center
            </div>
        );
    }

    componentDidMount() {

    }
}

StatusBar.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar);
