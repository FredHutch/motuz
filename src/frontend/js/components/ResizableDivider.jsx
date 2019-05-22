import React from 'react';

/**
 * Usage:
 * <ResizableDivider onResize={() => { console.info(resized) }}/>
 */

class ResizableDivider extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this)
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this)
    }

    render() {
        return (
            <div
                className='component-resizable-divider'
                onMouseDown={(event) => {this.onMouseDown(event)}}
            />
        );
    }

    onMouseDown(event) {
        document.addEventListener('mouseup', this.onDocumentMouseUp);
        document.addEventListener('mousemove', this.onDocumentMouseMove);
    }

    onDocumentMouseMove(event) {
        this.props.onResize(event)
    }

    onDocumentMouseUp(event) {
        document.removeEventListener('mouseup', this.onDocumentMouseUp);
        document.removeEventListener('mousemove', this.onDocumentMouseMove);
    }
}

ResizableDivider.defaultProps = {
    onResize: (event) => {},
};

export default ResizableDivider;
