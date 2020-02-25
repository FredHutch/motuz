import React from 'react';

import CopyJobTable from 'views/App/CopyJobSection/CopyJobTable.jsx'
import CopyJobSectionHeader from 'views/App/CopyJobSection/CopyJobSectionHeader.jsx'
import ResizableDivider from 'components/ResizableDivider.jsx'


const MINIMUM_SECTION_SIZE = 28; // px
const DEFAULT_SECTION_SIZE = 136; // px


class CopyJobSection extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = CopyJobSection.initialState;
    }

    render() {
        return (
            <div
                id={this.props.id}
                ref={this.container}
                style={{
                    position: 'relative',
                    height: this.state.height,
                }}
            >
                <ResizableDivider onResize={event => this.onResize(event)} />
                <CopyJobSectionHeader
                    onResizeToggle={() => this.onResizeToggle()}
                    isMinimized={this.isMinimized()}
                />
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

        this.resizeTo(newHeight)
    }

    onResizeToggle() {
        this.resizeTo(this.isMinimized() ? DEFAULT_SECTION_SIZE : 0)
    }

    resizeTo(height) {
        height = Math.max(height, MINIMUM_SECTION_SIZE)
        this.setState({height})
    }

    isMinimized() {
        return this.state.height === MINIMUM_SECTION_SIZE
    }
}

CopyJobSection.defaultProps = {
}

CopyJobSection.initialState = {
    height: DEFAULT_SECTION_SIZE,
}

export default CopyJobSection;
