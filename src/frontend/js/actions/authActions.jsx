import { RSAA } from 'redux-api-middleware';

import { withRefresh } from 'reducers/reducers.jsx';

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@auth/LOGIN_FAILURE';

export const REFRESH_TOKEN_REQUEST = '@@auth/REFRESH_TOKEN_REQUEST';
export const REFRESH_TOKEN_SUCCESS = '@@auth/REFRESH_TOKEN_SUCCESS';
export const REFRESH_TOKEN_FAILURE = '@@auth/REFRESH_TOKEN_FAILURE';

export const LOGOUT_REQUEST = '@@auth/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = '@@auth/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = '@@auth/LOGOUT_FAILURE';

export const login = (username, password) => ({
    [RSAA]: {
        endpoint: '/api/auth/login/',
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
        ]
    }
});

export const logout = (refresh_token) => ({
    [RSAA]: {
        endpoint: '/api/auth/logout/',
        method: 'POST',
        headers: withRefresh({ 'Content-Type': 'application/json' }),
        types: [
            LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE
        ]
    }
});


export const refreshAccessToken = (refresh_token) => ({
    [RSAA]: {
        endpoint: '/api/auth/refresh/',
        method: 'POST',
        headers: withRefresh({ 'Content-Type': 'application/json' }),
        types: [
            REFRESH_TOKEN_REQUEST, REFRESH_TOKEN_SUCCESS, REFRESH_TOKEN_FAILURE
        ]
    }
});
