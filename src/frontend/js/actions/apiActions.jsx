import { RSAA } from 'redux-api-middleware';

import { withAuth } from 'reducers/reducers.jsx';

export const LIST_FILES_REQUEST = '@@api/LIST_FILES_REQUEST';
export const LIST_FILES_SUCCESS = '@@api/LIST_FILES_SUCCESS';
export const LIST_FILES_FAILURE = '@@api/LIST_FILES_FAILURE';


export const listFiles = (side, path) => ({
    [RSAA]: {
        endpoint: '/api/system/files',
        method: 'POST',
        body: JSON.stringify({path}),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            LIST_FILES_REQUEST, LIST_FILES_SUCCESS, LIST_FILES_FAILURE
        ]
    }
});
