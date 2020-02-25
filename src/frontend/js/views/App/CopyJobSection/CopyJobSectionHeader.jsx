import React from 'react';
import classnames from 'classnames';

import CopyJobTable from 'views/App/CopyJobSection/CopyJobTable.jsx'
import ResizableDivider from 'components/ResizableDivider.jsx'
import Icon from 'components/Icon.jsx'

class CopyJobSectionHeader extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='copy-job-section-header'>
                <div
                    className={classnames({
                        'section-tab': true,
                        'pr-4': true,
                        'active': this.props.value === 0,
                    })}
                    onClick={() => this.props.onChange(0)}
                >
                    Transfers
                </div>
                <div
                    className={classnames({
                        'section-tab': true,
                        'pr-4': true,
                        'active': this.props.value === 1,
                    })}
                    onClick={() => this.props.onChange(1)}
                >
                    Verifications
                </div>
                <div
                    className='ml-auto section-tab'
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
    value: 0,
    onChange: () => {},
}

export default CopyJobSectionHeader;
