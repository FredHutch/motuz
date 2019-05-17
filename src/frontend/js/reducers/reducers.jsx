import { combineReducers } from 'redux';

import templateReducer from 'reducers/templateReducer.jsx'

export default (history) => combineReducers({
    rawData: templateReducer,
});
