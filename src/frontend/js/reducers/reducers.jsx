import { combineReducers } from 'redux';

import authReducer, * as fromAuth from 'reducers/authReducer.jsx';
import paneReducer from 'reducers/paneReducer.jsx'
import copyJobReducer from 'reducers/copyJobReducer.jsx'

export default (history) => combineReducers({
    pane: paneReducer,
    copyJob: copyJobReducer,
});



export function withAuth(headers={}) {
    return (state) => {
        const ret = {...headers};
        if (accessToken(state)) {
            ret['Authorization'] = `Bearer ${accessToken(state)}`;
        }
        return ret;
    };
}

export const isAuthenticated =
   state => fromAuth.isAuthenticated(state.auth);

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

export const loggedInPlayer = state => {
    const userId = fromAuth.userId(state.auth);
    if (userId == null) {
        return null;
    }
    return state.api.playerList.find(d => d.id === userId);
};
