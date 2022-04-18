import { combineReducers } from 'redux';

import alertReducer from 'reducers/alertReducer.jsx'
import authReducer, * as fromAuth from 'reducers/authReducer.jsx';
import apiReducer from 'reducers/apiReducer.jsx'
import dialogReducer from 'reducers/dialogReducer.jsx'
import paneReducer from 'reducers/paneReducer.jsx'
import settingsReducer from 'reducers/settingsReducer.jsx'
import loadersReducer from 'reducers/loadersReducer.jsx'

export default (history) => combineReducers({
    alert: alertReducer,
    auth: authReducer,
    api: apiReducer,
    dialog: dialogReducer,
    pane: paneReducer,
    settings: settingsReducer,
    loaders: loadersReducer,
});


export function withAuth(headers={}) {
    return (state) => {
        const ret = {...headers};
        const token = accessToken(state);
        if (token) {
            ret['Authorization'] = `Bearer ${token}`;
        }
        return ret;
    };
}

export function withRefresh(headers={}) {
    return (state) => {
        const ret = {...headers};
        const token = refreshToken(state);
        if (token) {
            ret['Authorization'] = `Bearer ${token}`;
        }
        return ret;
    };
}

export const accessToken =
    state => fromAuth.accessToken(state.auth);

export const isAccessTokenExpired =
    state => fromAuth.isAccessTokenExpired(state.auth);

export const refreshToken =
    state => fromAuth.refreshToken(state.auth);

export const isRefreshTokenExpired =
    state => fromAuth.isRefreshTokenExpired(state.auth);

export const authErrors =
    state => fromAuth.errors(state.auth);
