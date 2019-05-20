import React from 'react';

import Pane from 'views/Pane/Pane.jsx';

class TemplateComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Pane></Pane>
        );
    }

    componentDidMount() {

    }
}

TemplateComponent.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateComponent);
