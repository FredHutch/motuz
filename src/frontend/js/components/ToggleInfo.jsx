import React from 'react';
import Toggle from 'react-toggle'

import Info from 'components/Info.jsx'

class ToggleInfo extends React.PureComponent {
    render() {
        return (
            <Info {...this.props}>
                <div>
                    <Toggle checked={true} readOnly={true}/>
                    <p>
                        {this.props.on}
                    </p>
                </div>
                <hr/>
                <div>
                    <Toggle checked={false} readOnly={true}/>
                    <p>
                        {this.props.off}
                    </p>
                </div>
            </Info>
        )
    }
}

ToggleInfo.defaultProps = {
    on: '',
    off: '',
}

export default ToggleInfo;
