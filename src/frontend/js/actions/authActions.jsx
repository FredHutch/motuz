import { RSAA } from 'redux-api-middleware';

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@auth/LOGIN_FAILURE';

export const TOKEN_REQUEST = '@@auth/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@auth/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@auth/TOKEN_FAILURE';

export const LOGOUT_REQUEST = '@@auth/LOGOUT_REQUEST';

export const login = (email, password) => ({
    [RSAA]: {
        endpoint: '/api/auth/token/obtain/',
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
        ]
    }
});

export const logout = () => ({
    type: LOGOUT_REQUEST,
    payload: {},
});

export const refreshAccessToken = (token) => ({
    [RSAA]: {
        endpoint: '/api/auth/token/refresh/',
        method: 'POST',
        body: JSON.stringify({refresh: token}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
        ]
    }
});
