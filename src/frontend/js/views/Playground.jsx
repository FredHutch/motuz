import React from 'react';

import CreatableSelect from 'react-select/creatable';

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

        const handleFocus = (event) => {
            // console.log(event)
            // console.log(event.target)
            // console.log(event.currentTarget)
            // console.log('focusing', this.ref.current.state)
            if (this.state.value) {
                this.ref.current.setState({inputValue:this.state.value.label})
            }
        }

        return (
            <div className='col-6'>
                <CreatableSelect
                    options={options}
                    openMenuOnClick={false}
                    onMenuOpen={() => console.log('open')}
                    onMenuClose={() => console.log('close')}
                    // noOptionsMessage={(inputValue) => null}
                    onChange={(value) => this.setState({value})}
                    value={this.state.value}
                    blurInputOnSelect={true}
                    formatCreateLabel={(inputValue) => `Go to ${inputValue}`}
                    formatOptionLabel={formatOptionLabel}
                    filterOption={(option, inputValue) => {
                        return inputValue === "" || option.data.__isNew__
                    }}
                    ref={this.ref}
                    onFocus={handleFocus}
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
