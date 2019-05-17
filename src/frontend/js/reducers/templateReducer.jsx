import * as template from 'actions/templateAction.jsx';

const initialState = {
    value: 0,
};

export default (state=initialState, action) => {
    switch(action.type) {
    case template.CHANGE_VALUE: {
        return {
            ...state,
            value: action.payload,
        }
    }
    default:
        return state;
    }
};
