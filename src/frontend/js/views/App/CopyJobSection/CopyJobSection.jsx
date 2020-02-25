import React from 'react';

import CopyJobTable from 'views/App/CopyJobSection/CopyJobTable.jsx'
import HashsumJobTable from 'views/App/CopyJobSection/HashsumJobTable.jsx'
import CopyJobSectionHeader from 'views/App/CopyJobSection/CopyJobSectionHeader.jsx'
import ResizableDivider from 'components/ResizableDivider.jsx'


const MINIMUM_SECTION_HEIGHT = 28; // px
const DEFAULT_SECTION_HEIGHT = 136; // px


class CopyJobSection extends React.PureComponent {
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
                    value={this.state.value}
                    onChange={value => this.setState({value})}
                />
                {this.state.value === 0 && <CopyJobTable />}
                {this.state.value === 1 && <HashsumJobTable />}
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
        this.resizeTo(this.isMinimized() ? DEFAULT_SECTION_HEIGHT : 0)
    }

    resizeTo(height) {
        height = Math.max(height, MINIMUM_SECTION_HEIGHT)
        this.setState({height})
    }

    isMinimized() {
        return this.state.height === MINIMUM_SECTION_HEIGHT
    }
}

CopyJobSection.defaultProps = {
}

CopyJobSection.initialState = {
    height: DEFAULT_SECTION_HEIGHT,
    value: 0,
}

export default CopyJobSection;
