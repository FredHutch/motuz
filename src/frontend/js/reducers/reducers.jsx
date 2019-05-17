import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

import templateReducer from 'reducers/templateReducer.jsx'

export default (history) => combineReducers({
    router: connectRouter(history),
    rawData: templateReducer,
});
