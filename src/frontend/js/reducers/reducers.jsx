import { combineReducers } from 'redux';

import templateReducer from 'reducers/templateReducer.jsx'

export default combineReducers({
    rawData: templateReducer,
});
