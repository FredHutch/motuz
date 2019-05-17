import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            App
        </div>;
    }

    componentDidMount() {

    }
}

App.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
