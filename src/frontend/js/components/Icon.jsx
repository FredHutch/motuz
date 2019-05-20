import React from 'react';
import Octicon, {getIconByName} from '@githubprimer/octicons-react'

/**
 * Documentation:
 * https://octicons.github.com/
 *
 * Usage:
 * <Icon name='check' className='mt-2'/>
 */

class Icon extends React.PureComponent {
    render() {
        return <Octicon icon={getIconByName(this.props.name)} {...this.props} />
    }
}

Icon.defaultProps = {
    name: '',
};

export default Icon;
