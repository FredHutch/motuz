import React from 'react';
import { Button } from 'react-bootstrap'

import Icon from 'components/Icon.jsx'


class VerifyStatusButton extends React.PureComponent {
    render() {
        const {loading, success} = this.props;

        if (loading) {
            return (
                <Button variant='outline-warning' className='ml-2' disabled>
                    <span> Verifying... </span>
                </Button>
            )
        }

        if (success == null) {
            return <div></div>
        }

        if (success) {
            return (
                <Button variant='outline-success' className='ml-2' disabled>
                    <Icon name='check'/>
                    <span> Correct </span>
                </Button>
            )
        }

        if (!success) {
            return (
                <Button variant='outline-danger' className='ml-2' disabled>
                    <Icon name='x'/>
                    <span> Incorrect </span>
                </Button>
            )
        }
    }
}

VerifyStatusButton.defaultProps = {
    loading: false,
    success: null,
}

export default VerifyStatusButton;
