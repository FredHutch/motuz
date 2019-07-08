import React from "react";

class UriResource extends React.PureComponent {
    render() {
        const {protocol, path} = this.props;
        return (
            <React.Fragment>
                <b>{protocol}</b>
                <span>://</span>
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
