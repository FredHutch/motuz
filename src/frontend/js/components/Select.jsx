import React from 'react';


class Select extends React.PureComponent {
    render() {
        return (
            <select {...this.props}>
                {this.props.options.map(d =>
                    <option
                        value={d.value}
                        key={d.value}
                    >
                        {d.label}
                    </option>
                )}
            </select>
        );
    }
}

Select.defaultProps = {
    options: [],
};

export default Select;
