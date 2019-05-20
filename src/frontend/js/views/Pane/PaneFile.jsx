import React from 'react';
import classnames from 'classnames';

import Icon from 'components/Icon.jsx'
import formatBytes from 'utils/formatBytes.jsx'


class PaneFile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {type, name, size} = this.props;

        return (
            <React.Fragment>
                <div
                    className={classnames({
                        'grid-file-row': true,
                        'active': this.props.active,
                        'pl-2': true,
                    })}
                    onClick={event => this.props.onClick(event)}
                >
                    <Icon
                        name={type === 'dir' ? 'file-directory' : 'file'}
                        className='mr-2'
                    />
                    {name}
                </div>
                <div
                    className={classnames({
                        'text-right': true,
                        'grid-file-row': true,
                        'active': this.props.active,
                        'pr-2': true,
                    })}
                    onClick={event => this.props.onClick(event)}
                >
                    <em>
                        {type === 'dir' ? 'Folder' : formatBytes(size)}
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
    onClick: event => {},
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PaneFile);
