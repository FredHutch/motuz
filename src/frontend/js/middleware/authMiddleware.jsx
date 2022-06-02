import { isRSAA, apiMiddleware } from 'redux-api-middleware';

import { REFRESH_TOKEN_SUCCESS, refreshAccessToken } from 'actions/authActions.jsx';
import { refreshToken, isAccessTokenExpired, isRefreshTokenExpired } from 'reducers/reducers.jsx';


function createAuthMiddleware() {
    let postponedRSAAs = [];

    return ({ dispatch, getState }) => {
        const rsaaMiddleware = apiMiddleware({dispatch, getState});

        return (next) => (action) => {
            const nextCheckPostponed = (nextAction) => {
                // Run postponed actions after token refresh
                if (nextAction.type === REFRESH_TOKEN_SUCCESS) {
                    next(nextAction);
                    postponedRSAAs.forEach((postponed) => {
                        rsaaMiddleware(next)(postponed);
                    });
                    postponedRSAAs = [];
                } else {
                    next(nextAction);
                }
            };

            if (isRSAA(action)) {
                const state = getState()
                const token = refreshToken(state);

                if (token && isAccessTokenExpired(state) && !isRefreshTokenExpired(state)) {
                    postponedRSAAs.push(action);
                    if (postponedRSAAs.length === 1) {
                        return rsaaMiddleware(nextCheckPostponed)(refreshAccessToken(token));
                    } else {
                        return;
                    }
                }

                return rsaaMiddleware(next)(action);
            }
            return next(action);
        };
    };
}

export default createAuthMiddleware();
