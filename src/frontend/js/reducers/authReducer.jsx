import jwtDecode from 'jwt-decode';

import * as auth from 'actions/authActions.jsx';

const initialState = {
    access: undefined,
    refresh: undefined,
    errors: {},
    loading: false,
};

export default (state=initialState, action) => {
    switch(action.type) {
    case auth.LOGIN_REQUEST:
    case auth.LOGOUT_REQUEST: {
        return {
            ...state,
            loading: true,
            errors: initialState.errors,
        }
    }
    case auth.LOGIN_SUCCESS: {
        return {
            access: {
                token: action.payload.access,
                ...jwtDecode(action.payload.access),
            },
            refresh: {
                token: action.payload.refresh,
                ...jwtDecode(action.payload.refresh),
            },
            errors: {},
            loading: false,
        };
    }
    case auth.REFRESH_TOKEN_SUCCESS: {
        return {
            ...state,
            access: {
                token: action.payload.access,
                ...jwtDecode(action.payload.access)
            },
            refresh: {
                token: action.payload.refresh,
                ...jwtDecode(action.payload.refresh),
            },
        };
    }
    case auth.LOGIN_FAILURE:
    case auth.REFRESH_TOKEN_FAILURE:
    {
        return {
            access: undefined,
            refresh: undefined,
            errors: action.payload.response || action.payload,
            loading: false,
        };
    }
    case auth.LOGOUT_SUCCESS:
    case auth.LOGOUT_FAILURE: // Delete tokens on failure as well
    {
        return initialState;
    }
    default:
        return state;
    }
};


export function accessToken(state) {
    if (state.access) {
        return state.access.token;
    }
}

export function refreshToken(state) {
    if (state.refresh) {
        return state.refresh.token;
    }
}

export function isAccessTokenExpired(state) {
    if (state.access && state.access.exp) {
        return 1000 * state.access.exp - (new Date()).getTime() < 5000;
    }
    return true;
}

export function isRefreshTokenExpired(state) {
    if (state.refresh && state.refresh.exp) {
        return 1000 * state.refresh.exp - (new Date()).getTime() < 5000;
    }
    return true;
}

export function isAuthenticated(state) {
    // return !isRefreshTokenExpired(state);
    return true;
}

export function errors(state) {
    return  state.errors;
}

export function _getCurrentUser() {
    return fetch("/api/auth/get_current_user/")
        .then(response => response.json())
}

// no longer called - I think
export function getCurrentUser(state) {
    var request = new XMLHttpRequest();
    // bad synchronous ajax request - deprecated 
    // TODO FIXME
    request.open('GET', '/api/auth/get_current_user/', false);
    request.send(null);
    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } 
    if (!state) {
        return 'ERROR STATE';
    }

    if (!state.access) {
        return 'ERROR ACCESS'
    }

    if (!state.access.identity) {
        return 'ERROR SUB'
    }

    return state.access.identity
}
