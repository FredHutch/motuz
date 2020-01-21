import React from 'react';

import Creatable from 'react-select/creatable';

import Select from 'components/Select.jsx';
import Icon from 'components/Icon.jsx'

class Playground extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        }
        this.ref = React.createRef()
    }

    render() {
        const options = [
            {label: "hello", value: "world"},
            {label: "hello2", value: "world2"},
        ]

        const formatOptionLabel = (data, {context}) => {
            return (
                <React.Fragment>
                    {context === 'menu' && !data.__isNew__ && <Icon name="history" />} {data.label}
                </React.Fragment>
            )
        }

        return (
            <div className='col-6'>
                <Creatable
                    options={options}
                    onChange={(value) => this.setState({value})}
                    value={this.state.value}
                    openMenuOnClick={false}
                    openMenuOnFocus={false}
                    blurInputOnSelect={true}
                    noOptionsMessage={(inputValue) => null}
                    formatCreateLabel={(inputValue) => `Go to ${inputValue}`}
                    formatOptionLabel={formatOptionLabel}
                    filterOption={(option, inputValue) => inputValue === "" || option.data.__isNew__}
                    isValidNewOption={(inputValue) => inputValue}
                />
                <button onClick={() => console.log(this.state.value)}>Click</button>
            </div>
        );
    }

    componentDidMount() {
    }
}

Playground.defaultProps = {
}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Playground);
