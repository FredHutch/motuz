import React from 'react';
import classnames from 'classnames';

import Icon from 'components/Icon.jsx'
import formatBytes from 'utils/formatBytes.jsx'


class PaneFile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {type, name, size, useSiUnits} = this.props;

        return (
            <React.Fragment>
                <div
                    className={classnames({
                        'grid-file-row': true,
                        'active': this.props.active,
                    })}
                    style={{paddingLeft: "10px"}}
                    onClick={event => this.props.onClick(event)}
                    onDoubleClick={event => this.props.onDoubleClick(event)}
                    onMouseDown={event => this.props.onMouseDown(event)}
                >
                    <Icon
                        name={type === 'dir' ? 'file-directory' : 'file'}
                        className='mr-2 octicon'
                    />
                    <span>{name}</span>
                </div>
                <div
                    className={classnames({
                        'text-right': true,
                        'grid-file-row': true,
                        'active': this.props.active,
                        'pr-2': true,
                    })}
                    onClick={event => this.props.onClick(event)}
                    onDoubleClick={event => this.props.onDoubleClick(event)}
                    onMouseDown={event => this.props.onMouseDown(event)}
                >
                    <em>
                        {type === 'dir' ? 'Folder' : formatBytes(size, useSiUnits)}
                    </em>
                </div>
            </React.Fragment>
        );
    }

    componentDidMount() {

    }
}

PaneFile.defaultProps = {
    type: 'dir',
    name: '',
    size: 0,
    useSiUnits: false,
    onClick: event => {},
    onDoubleClick: event => {},
    onMouseDown: event => {},
}

export default PaneFile;
