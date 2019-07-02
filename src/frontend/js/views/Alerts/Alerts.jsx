import React from 'react';
import { Alert } from 'react-bootstrap'

class Alerts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.show) {
            return <React.Fragment />
        }

        return (
            <div style={{
                position: 'absolute',
                top: '5rem',
                padding: 30,
                width: '100%',
            }}>
                <Alert
                    variant="danger"
                    onClose={() => this.props.onDismiss()}
                    dismissible
                >
                    <Alert.Heading>Something went wrong!</Alert.Heading>
                        <pre>
                            {JSON.stringify(this.props.text)}
                        </pre>
                </Alert>
            </div>
        );
    }

    componentDidMount() {

    }
}

Alerts.defaultProps = {
    show: true,
    text: 'Foo',
    onDismiss: () => {},
}

import {connect} from 'react-redux';
import {hideAlert} from 'actions/alertActions.jsx'

const mapStateToProps = state => ({
    show: state.alert.show,
    text: state.alert.text,
});

const mapDispatchToProps = dispatch => ({
    onDismiss: () => dispatch(hideAlert())
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
