import React from "react";
import { Tooltip, OverlayTrigger, Button } from 'react-bootstrap'

import {copyToClipboardElement} from 'utils/clipboard.jsx'

class UriResource extends React.PureComponent {
    constructor(props) {
        super(props)
        this.textRef = React.createRef()
        this.tooltipRef = React.createRef()
        this.state = UriResource.initialState;
        this.timeoutHandler = null
    }

    render() {
        const {protocol} = this.props
        let {path} = this.props

        if (protocol !== 'file') {
            path = path.replace(/^\/*/, '') // No leading slashes
        }

        const content = (
            <React.Fragment>
                <b>{protocol}</b>
                <span>://</span>
                <span>{path}</span>

            </React.Fragment>
        )

        if (!this.props.canCopy) {
            return content
        }

        return (
            <React.Fragment>
                <OverlayTrigger
                    placement="left"
                    shouldUpdatePosition={true}
                    delay={{ show: this.state.tooltipHoverDelay, hide: 100 }}
                    overlay={props => (
                        <Tooltip
                            {...props }
                            show={props.show.toString()}
                        >
                            {this.state.tooltipText}
                        </Tooltip>
                    )}
                >
                    <span
                        className='cursor-pointer'
                        ref={this.textRef}
                        onClick={() => this.onCopy()}
                    >
                        {content}
                    </span>
                </OverlayTrigger>
            </React.Fragment>
        )
    }

    componentWillUnmount() {
        if (this.timeoutHandler != null) {
            clearTimeout(this.timeoutHandler)
            this.timeoutHandler = null
        }
    }

    onCopy() {
        const success = copyToClipboardElement(this.textRef.current)

        if (success) {
            this.setState({tooltipText: 'Copied'})
        } else {
            this.setState({tooltipText: 'Copy Failed'})
        }

        if (this.timeoutHandler == null) {
            this.timeoutHandler = window.setTimeout(() => {
                this.timeoutHandler = null
                this.setState({tooltipText: UriResource.initialState.tooltipText})
            }, 1000)
        }
    }
}

UriResource.defaultProps = {
    protocol: '',
    path: '',
    canCopy: false,
}

UriResource.initialState = {
    tooltipText: 'Click to copy',
    tooltipHoverDelay: 500,
}

export default UriResource;
