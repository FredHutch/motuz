import { combineReducers } from 'redux';

import paneReducer from 'reducers/paneReducer.jsx'
import copyJobReducer from 'reducers/copyJobReducer.jsx'

export default (history) => combineReducers({
    pane: paneReducer,
    pane: copyJobReducer,
});
