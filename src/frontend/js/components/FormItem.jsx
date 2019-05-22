import React from "react";

export default class FormItem extends React.PureComponent {
    render() {
        const { id, label, name, type, small, placeholder } = this.props;

        return (
            <div className="form-group">
                <label
                    htmlFor={id}
                >
                    {label}
                </label>
                <input
                    type={type}
                    className="form-control"
                    id={id}
                    aria-describedby={`${id}-small`}
                    placeholder={placeholder}
                />
                {small && <small
                    id={`${id}-small`}
                    className="form-text text-muted"
                >
                    {small}
                </small> }
            </div>

        );
    }
}


FormItem.defaultProps = {
    id: null,
    label: '',
    name: '',
    type: 'text',
    small: null,
    placeholder: null,
}