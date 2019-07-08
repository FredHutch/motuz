import React from "react";

class UriResource extends React.PureComponent {
    render() {
        const {protocol, path} = this.props;
        const separator = (protocol === 'file' ? '://' : ':/');
        return (
            <React.Fragment>
                <b>{protocol}</b>
                <span>{separator}</span>
                <span>{path}</span>
            </React.Fragment>
        )
    }
}

UriResource.defaultProps = {
    'protocol': '',
    'path': '',
}

export default UriResource;
