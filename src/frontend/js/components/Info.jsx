import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap'

import Icon from 'components/Icon.jsx'

class Info extends React.PureComponent {
    render() {
        return (
            <OverlayTrigger
                trigger="focus"
                placement="bottom"
                overlay={props => (
                    <Popover
                        {...props }
                        show={props.show.toString()}
                    >
                        {this.props.children}
                    </Popover>
                )}
            >
                <a
                    className={this.props.className}
                    href="javascript:void(0);"
                >
                    <Icon name='question' verticalAlign='top' />
                </a>
            </OverlayTrigger>
        )
    }
}

export default Info;
