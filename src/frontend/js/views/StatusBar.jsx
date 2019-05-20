import React from 'react';

class TemplateComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                TemplateComponent
            </div>
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
