import React from 'react';

import CopyJobTable from 'views/App/CopyJobSection/CopyJobTable.jsx'
import ResizableDivider from 'components/ResizableDivider.jsx'

class CopyJobSection extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
    }

    render() {
        return (
            <div
                id={this.props.id}
                ref={this.container}
                style={{position: 'relative'}}
            >
                <ResizableDivider onResize={event => this.onResize(event)} />
                <CopyJobTable />
            </div>
        );
    }

    componentDidMount() {
    }

    onResize(event) {
        const container = this.container.current

        const newTop = event.pageY;
        const oldTop = container.offsetTop;

        const oldHeight = container.offsetHeight;
        const newHeight = oldHeight + oldTop - newTop;

        container.style.height = `${newHeight}px`
    }
}

CopyJobSection.defaultProps = {
}

export default CopyJobSection;
