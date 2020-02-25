import React from 'react';
import classnames from 'classnames';

import CopyJobTable from 'views/App/CopyJobSection/CopyJobTable.jsx'
import ResizableDivider from 'components/ResizableDivider.jsx'
import Icon from 'components/Icon.jsx'

class CopyJobSectionHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = CopyJobSectionHeader.initialState;
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    fontSize: "12px",
                    padding: ".3rem",
                    backgroundColor: "rgba(0,0,0,.05)",
                }}
            >
                <div
                    style={{
                        cursor: "pointer",
                    }}
                    className={classnames({
                        'pr-4': true,
                        'font-weight-bold': this.state.toggle,
                        'text-primary': !this.state.toggle,
                    })}
                    onClick={() => this.setState({toggle: !this.state.toggle})}
                >
                    Transfers
                </div>
                <div
                    style={{
                        cursor: "pointer",
                    }}
                    className={classnames({
                        'pr-4': true,
                        'font-weight-bold': !this.state.toggle,
                        'text-primary': this.state.toggle,
                    })}
                    onClick={() => this.setState({toggle: !this.state.toggle})}
                >
                    Verifications
                </div>
                <div
                    style={{
                        cursor: "pointer",
                    }}
                    className='ml-auto text-primary'
                    onClick={() => this.props.onResizeToggle()}
                >
                    <span>
                        {this.props.isMinimized ? 'Open pane' : 'Collapse Pane'}
                    </span>
                    <Icon
                        name={this.props.isMinimized ? 'chevron-up' : 'chevron-down'}
                        className='ml-2'
                    />
                </div>
            </div>
        );
    }

    componentDidMount() {
    }
}

CopyJobSectionHeader.defaultProps = {
    onResizeToggle: () => {},
    isMinimized: false,
}

CopyJobSectionHeader.initialState = {
    toggle: true,
}

export default CopyJobSectionHeader;
