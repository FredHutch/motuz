import { RSAA } from 'redux-api-middleware';
import upath from 'upath';

import { withAuth } from 'reducers/reducers.jsx';
import * as pane from 'actions/paneActions.jsx'
import * as dialog from 'actions/dialogActions.jsx'
import { getCurrentPane, getCurrentFiles, fileExists } from 'managers/paneManager.jsx'
import { getJobsInProgressForDestination } from 'managers/apiManager.jsx'

export const LIST_FILES_REQUEST = '@@api/LIST_FILES_REQUEST';
export const LIST_FILES_SUCCESS = '@@api/LIST_FILES_SUCCESS';
export const LIST_FILES_FAILURE = '@@api/LIST_FILES_FAILURE';

export const LIST_HOME_FILES_REQUEST = '@@api/LIST_HOME_FILES_REQUEST';
export const LIST_HOME_FILES_SUCCESS = '@@api/LIST_HOME_FILES_SUCCESS';
export const LIST_HOME_FILES_FAILURE = '@@api/LIST_HOME_FILES_FAILURE';

export const MAKE_DIRECTORY_REQUEST = '@@api/MAKE_DIRECTORY_REQUEST';
export const MAKE_DIRECTORY_SUCCESS = '@@api/MAKE_DIRECTORY_SUCCESS';
export const MAKE_DIRECTORY_FAILURE = '@@api/MAKE_DIRECTORY_FAILURE';

export const LIST_COPY_JOBS_REQUEST = '@@api/LIST_COPY_JOBS_REQUEST';
export const LIST_COPY_JOBS_SUCCESS = '@@api/LIST_COPY_JOBS_SUCCESS';
export const LIST_COPY_JOBS_FAILURE = '@@api/LIST_COPY_JOBS_FAILURE';

export const RETRIEVE_COPY_JOB_REQUEST = '@@api/RETRIEVE_COPY_JOB_REQUEST';
export const RETRIEVE_COPY_JOB_SUCCESS = '@@api/RETRIEVE_COPY_JOB_SUCCESS';
export const RETRIEVE_COPY_JOB_FAILURE = '@@api/RETRIEVE_COPY_JOB_FAILURE';

export const CREATE_COPY_JOB_REQUEST = '@@api/CREATE_COPY_JOB_REQUEST';
export const CREATE_COPY_JOB_SUCCESS = '@@api/CREATE_COPY_JOB_SUCCESS';
export const CREATE_COPY_JOB_FAILURE = '@@api/CREATE_COPY_JOB_FAILURE';

export const STOP_COPY_JOB_REQUEST = '@@api/STOP_COPY_JOB_REQUEST';
export const STOP_COPY_JOB_SUCCESS = '@@api/STOP_COPY_JOB_SUCCESS';
export const STOP_COPY_JOB_FAILURE = '@@api/STOP_COPY_JOB_FAILURE';


export const LIST_HASHSUM_JOBS_REQUEST = '@@api/LIST_HASHSUM_JOBS_REQUEST';
export const LIST_HASHSUM_JOBS_SUCCESS = '@@api/LIST_HASHSUM_JOBS_SUCCESS';
export const LIST_HASHSUM_JOBS_FAILURE = '@@api/LIST_HASHSUM_JOBS_FAILURE';

export const RETRIEVE_HASHSUM_JOB_REQUEST = '@@api/RETRIEVE_HASHSUM_JOB_REQUEST';
export const RETRIEVE_HASHSUM_JOB_SUCCESS = '@@api/RETRIEVE_HASHSUM_JOB_SUCCESS';
export const RETRIEVE_HASHSUM_JOB_FAILURE = '@@api/RETRIEVE_HASHSUM_JOB_FAILURE';

export const CREATE_HASHSUM_JOB_REQUEST = '@@api/CREATE_HASHSUM_JOB_REQUEST';
export const CREATE_HASHSUM_JOB_SUCCESS = '@@api/CREATE_HASHSUM_JOB_SUCCESS';
export const CREATE_HASHSUM_JOB_FAILURE = '@@api/CREATE_HASHSUM_JOB_FAILURE';

export const STOP_HASHSUM_JOB_REQUEST = '@@api/STOP_HASHSUM_JOB_REQUEST';
export const STOP_HASHSUM_JOB_SUCCESS = '@@api/STOP_HASHSUM_JOB_SUCCESS';
export const STOP_HASHSUM_JOB_FAILURE = '@@api/STOP_HASHSUM_JOB_FAILURE';


export const LIST_CLOUD_CONNECTIONS_REQUEST = '@@api/LIST_CLOUD_CONNECTIONS_REQUEST';
export const LIST_CLOUD_CONNECTIONS_SUCCESS = '@@api/LIST_CLOUD_CONNECTIONS_SUCCESS';
export const LIST_CLOUD_CONNECTIONS_FAILURE = '@@api/LIST_CLOUD_CONNECTIONS_FAILURE';

export const CREATE_CLOUD_CONNECTION_REQUEST = '@@api/CREATE_CLOUD_CONNECTION_REQUEST';
export const CREATE_CLOUD_CONNECTION_SUCCESS = '@@api/CREATE_CLOUD_CONNECTION_SUCCESS';
export const CREATE_CLOUD_CONNECTION_FAILURE = '@@api/CREATE_CLOUD_CONNECTION_FAILURE';

export const UPDATE_CLOUD_CONNECTION_REQUEST = '@@api/UPDATE_CLOUD_CONNECTION_REQUEST';
export const UPDATE_CLOUD_CONNECTION_SUCCESS = '@@api/UPDATE_CLOUD_CONNECTION_SUCCESS';
export const UPDATE_CLOUD_CONNECTION_FAILURE = '@@api/UPDATE_CLOUD_CONNECTION_FAILURE';

export const DELETE_CLOUD_CONNECTION_REQUEST = '@@api/DELETE_CLOUD_CONNECTION_REQUEST';
export const DELETE_CLOUD_CONNECTION_SUCCESS = '@@api/DELETE_CLOUD_CONNECTION_SUCCESS';
export const DELETE_CLOUD_CONNECTION_FAILURE = '@@api/DELETE_CLOUD_CONNECTION_FAILURE';

export const VERIFY_CLOUD_CONNECTION_REQUEST = '@@api/VERIFY_CLOUD_CONNECTION_REQUEST';
export const VERIFY_CLOUD_CONNECTION_SUCCESS = '@@api/VERIFY_CLOUD_CONNECTION_SUCCESS';
export const VERIFY_CLOUD_CONNECTION_FAILURE = '@@api/VERIFY_CLOUD_CONNECTION_FAILURE';


export const listFiles = (side, data) => ({
    [RSAA]: {
        endpoint: '/api/system/files/',
        method: 'POST',
        body: JSON.stringify(data),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            {
                type: LIST_FILES_REQUEST,
                meta: {side, data},
            },
            {
                type: LIST_FILES_SUCCESS,
                meta: {side, data},
            },
            {
                type: LIST_FILES_FAILURE,
                meta: {side, data},
            },
        ]
    }
});

export const listHomeFiles = (data) => ({
    [RSAA]: {
        endpoint: '/api/system/files/home/',
        method: 'POST',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [
            {
                type: LIST_HOME_FILES_REQUEST,
                meta: {data},
            },
            {
                type: LIST_HOME_FILES_SUCCESS,
                meta: {data},
            },
            {
                type: LIST_HOME_FILES_FAILURE,
                meta: {data},
            },
        ],
    }
});

export const makeDirectory = (data) => {
    return async (dispatch, getState) => {
        const state = getState();
        const dirname = upath.dirname(data.path)
        const basename = upath.basename(data.path)
        if (fileExists(state.pane, dirname, basename) && !confirm(
            `${basename} already exists at destination. Overwrite?`
        )) {
            return;
        }

        await dispatch(_makeDirectory(data));
        await dispatch(dialog.hideMkdirDialog())
        await dispatch(pane.refreshPanes())
    }
}

export const _makeDirectory = (data) => ({
    [RSAA]: {
        endpoint: `/api/system/files/mkdir/`,
        method: 'POST',
        body: JSON.stringify(data),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ MAKE_DIRECTORY_REQUEST, MAKE_DIRECTORY_SUCCESS, MAKE_DIRECTORY_FAILURE ],
    }
});


export const listCopyJobs = (page) => ({
    [RSAA]: {
        endpoint: `/api/copy-jobs/?page=${page}`,
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ LIST_COPY_JOBS_REQUEST, LIST_COPY_JOBS_SUCCESS, LIST_COPY_JOBS_FAILURE ],
    }
});


export const retrieveCopyJob = (id) => ({
    [RSAA]: {
        endpoint: `/api/copy-jobs/${id}`,
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ RETRIEVE_COPY_JOB_REQUEST, RETRIEVE_COPY_JOB_SUCCESS, RETRIEVE_COPY_JOB_FAILURE ],
    }
});


export const createCopyJob = (data) => {
    return async (dispatch, getState) => {
        const state = getState();
        const dirname = upath.dirname(data.dst_resource_path)
        const basename = upath.basename(data.src_resource_path)
        if (fileExists(state.pane, dirname, basename) && !confirm(
            `${basename} already exists at destination. Overwrite?`
        )) {
            return;
        }
        const jobsInProgress = getJobsInProgressForDestination(state.api, data);
        if (jobsInProgress.length !== 0) {
            const jobIds = jobsInProgress.map(d => d.id).join(',')
            if (!confirm(
                `The following jobs already write to the same destination: ${jobIds}. ` +
                `Concurrent writes may be destructive. Continue?`
            )) {
                return;
            }
        }
        await dispatch(_createCopyJob(data));
        await dispatch(dialog.hideNewCopyJobDialog())
    }
}

const _createCopyJob = (data) => ({
    [RSAA]: {
        endpoint: `/api/copy-jobs/`, // TODO: Why is there a trailing slash here?
        method: 'POST',
        body: JSON.stringify(data),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ CREATE_COPY_JOB_REQUEST, CREATE_COPY_JOB_SUCCESS, CREATE_COPY_JOB_FAILURE ],
    }
});

export const stopCopyJob = (id) => ({
    [RSAA]: {
        endpoint: `/api/copy-jobs/${id}/stop/`, // TODO: Why is there a trailing slash here?
        method: 'PUT',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ STOP_COPY_JOB_REQUEST, STOP_COPY_JOB_SUCCESS, STOP_COPY_JOB_FAILURE ],
    }
});



export const listHashsumJobs = () => ({
    [RSAA]: {
        endpoint: `/api/hashsum-jobs/`,
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ LIST_HASHSUM_JOBS_REQUEST, LIST_HASHSUM_JOBS_SUCCESS, LIST_HASHSUM_JOBS_FAILURE ],
    }
});

export const retrieveHashsumJob = (id) => ({
    [RSAA]: {
        endpoint: `/api/hashsum-jobs/${id}`,
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ RETRIEVE_HASHSUM_JOB_REQUEST, RETRIEVE_HASHSUM_JOB_SUCCESS, RETRIEVE_HASHSUM_JOB_FAILURE ],
    }
});

export const createHashsumJob = (data) => {
    return async (dispatch, getState) => {
        await dispatch(_createHashsumJob(data));
        await dispatch(dialog.hideNewHashsumJobDialog())
    }
}

const _createHashsumJob = (data) => ({
    [RSAA]: {
        endpoint: `/api/hashsum-jobs/`, // TODO: Why is there a trailing slash here?
        method: 'POST',
        body: JSON.stringify(data),
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ CREATE_HASHSUM_JOB_REQUEST, CREATE_HASHSUM_JOB_SUCCESS, CREATE_HASHSUM_JOB_FAILURE ],
    }
});

export const stopHashsumJob = (id) => ({
    [RSAA]: {
        endpoint: `/api/hashsum-jobs/${id}/stop/`, // TODO: Why is there a trailing slash here?
        method: 'PUT',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ STOP_HASHSUM_JOB_REQUEST, STOP_HASHSUM_JOB_SUCCESS, STOP_HASHSUM_JOB_FAILURE ],
    }
});

export const listCloudConnections = (data) => ({
    [RSAA]: {
        endpoint: `/api/connections/`, // TODO: Why is there a trailing slash here?
        method: 'GET',
        headers: withAuth({ 'Content-Type': 'application/json' }),
        types: [ LIST_CLOUD_CONNECTIONS_REQUEST, LIST_CLOUD_CONNECTIONS_SUCCESS, LIST_CLOUD_CONNECTIONS_FAILURE ],
    }
});


export const createCloudConnection = (data) => {
    delete data.id;

    return {
        [RSAA]: {
            endpoint: `/api/connections/`, // TODO: Why is there a trailing slash here?
            method: 'POST',
            body: JSON.stringify(data),
            headers: withAuth({ 'Content-Type': 'application/json' }),
            types: [ CREATE_CLOUD_CONNECTION_REQUEST, CREATE_CLOUD_CONNECTION_SUCCESS, CREATE_CLOUD_CONNECTION_FAILURE ],
        }
    }
};

export const verifyCloudConnection = (data) => {
    delete data.id;

    return {
        [RSAA]: {
            endpoint: `/api/connections/verify/`, // TODO: Why is there a trailing slash here?
            method: 'POST',
            body: JSON.stringify(data),
            headers: withAuth({ 'Content-Type': 'application/json' }),
            types: [ VERIFY_CLOUD_CONNECTION_REQUEST, VERIFY_CLOUD_CONNECTION_SUCCESS, VERIFY_CLOUD_CONNECTION_FAILURE ],
        }
    }
};

export const updateCloudConnection = (data) => {
    const id = data.id;
    delete data.id;

    return {
        [RSAA]: {
            endpoint: `/api/connections/${id}`, // TODO: Why is there a trailing slash here?
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: withAuth({ 'Content-Type': 'application/json' }),
            types: [ UPDATE_CLOUD_CONNECTION_REQUEST, UPDATE_CLOUD_CONNECTION_SUCCESS, UPDATE_CLOUD_CONNECTION_FAILURE ],
        }
    }
};

export const deleteCloudConnection = (data) => {
    return {
        [RSAA]: {
            endpoint: `/api/connections/${data.id}`, // TODO: Why is there a trailing slash here?
            method: 'DELETE',
            headers: withAuth({ 'Content-Type': 'application/json' }),
            types: [ DELETE_CLOUD_CONNECTION_REQUEST, DELETE_CLOUD_CONNECTION_SUCCESS, DELETE_CLOUD_CONNECTION_FAILURE ],
        }
    }
};
