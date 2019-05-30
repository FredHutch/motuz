import { RSAA } from 'redux-api-middleware';

import { withAuth } from 'reducers/reducers.jsx';

export const LIST_FILES_REQUEST = '@@api/LIST_FILES_REQUEST';
export const LIST_FILES_SUCCESS = '@@api/LIST_FILES_SUCCESS';
export const LIST_FILES_FAILURE = '@@api/LIST_FILES_FAILURE';

export const LIST_COPY_JOBS_REQUEST = '@@api/LIST_COPY_JOBS_REQUEST';
export const LIST_COPY_JOBS_SUCCESS = '@@api/LIST_COPY_JOBS_SUCCESS';
export const LIST_COPY_JOBS_FAILURE = '@@api/LIST_COPY_JOBS_FAILURE';

export const RETRIEVE_COPY_JOB_REQUEST = '@@api/RETRIEVE_COPY_JOB_REQUEST';
export const RETRIEVE_COPY_JOB_SUCCESS = '@@api/RETRIEVE_COPY_JOB_SUCCESS';
export const RETRIEVE_COPY_JOB_FAILURE = '@@api/RETRIEVE_COPY_JOB_FAILURE';

export const CREATE_COPY_JOB_REQUEST = '@@api/CREATE_COPY_JOB_REQUEST';
export const CREATE_COPY_JOB_SUCCESS = '@@api/CREATE_COPY_JOB_SUCCESS';
export const CREATE_COPY_JOB_FAILURE = '@@api/CREATE_COPY_JOB_FAILURE';


export const listFiles = (side, path) => ({
    [RSAA]: {
        endpoint: '/api/system/files/',
        method: 'POST',
        body: JSON.stringify({uri: `file:///${path}`}),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            {
                type: LIST_FILES_REQUEST,
                meta: {side, path},
            },
            {
                type: LIST_FILES_SUCCESS,
                meta: {side, path},
            },
            {
                type: LIST_FILES_FAILURE,
                meta: {side, path},
            },
        ]
    }
});


export const listCopyJobs = () => ({
    [RSAA]: {
        endpoint: `/api/copy-jobs/`,
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ LIST_COPY_JOBS_REQUEST, LIST_COPY_JOBS_SUCCESS, LIST_COPY_JOBS_FAILURE ],
    }
});


export const retrieveCopyJob = (id) => ({
    [RSAA]: {
        endpoint: `/api/copy-jobs/${id}/`,
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ RETRIEVE_COPY_JOB_REQUEST, RETRIEVE_COPY_JOB_SUCCESS, RETRIEVE_COPY_JOB_FAILURE ],
    }
});


export const createCopyJob = (data) => ({
    [RSAA]: {
        endpoint: `/api/copy-jobs/`, // TODO: Why is there a trailing slash here?
        method: 'POST',
        body: JSON.stringify({...data}),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ CREATE_COPY_JOB_REQUEST, CREATE_COPY_JOB_SUCCESS, CREATE_COPY_JOB_FAILURE ],
    }
});
