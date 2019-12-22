import * as auth from 'actions/authActions.jsx';
import * as api from 'actions/apiActions.jsx';
import * as dialog from 'actions/dialogActions.jsx';
import reverseArray from 'utils/reverseArray.jsx';

const initialState = {
    clouds: [],
    cloudErrors: {},
    jobs: [],
    jobErrors: {},
    cloudConnectionVerification: {
        loading: false,
        success: null,
    }
};


export default (state=initialState, action) => {
    switch(action.type) {
    case api.LIST_COPY_JOBS_REQUEST: {
        return state;
    }
    case api.LIST_COPY_JOBS_SUCCESS: {
        const jobs = action.payload;
        jobs.sort((a, b) => b.id - a.id)
        return {
            ...state,
            jobs,
        }
    }
    case api.LIST_COPY_JOBS_FAILURE: {
        return state;
    }
    case api.RETRIEVE_COPY_JOB_REQUEST: {
        return state;
    }
    case api.RETRIEVE_COPY_JOB_SUCCESS: {
        const newJob = action.payload;
        const jobs = [...state.jobs]
        const index = jobs.findIndex(d => d.id === newJob.id)
        jobs[index] = newJob;

        return {
            ...state,
            jobs,
        }
    }
    case api.RETRIEVE_COPY_JOB_FAILURE: {
        return state;
    }
    case api.CREATE_COPY_JOB_REQUEST: {
        return state;
    }
    case api.CREATE_COPY_JOB_SUCCESS: {
        const newJob = action.payload;

        return {
            ...state,
            jobs: [
                newJob,
                ...state.jobs,
            ],
        }
    }
    case api.CREATE_COPY_JOB_FAILURE: {
        return state;
    }
    case api.STOP_COPY_JOB_REQUEST: {
        return state;
    }
    case api.STOP_COPY_JOB_SUCCESS: {
        const newJob = action.payload;
        const jobs = [...state.jobs]
        const index = jobs.findIndex(d => d.id === newJob.id)
        jobs[index] = newJob;

        return {
            ...state,
            jobs,
        }
    }
    case api.STOP_COPY_JOB_FAILURE: {
        return state;
    }



    case api.LIST_CLOUD_CONNECTIONS_REQUEST: {
        return state;
    }
    case api.LIST_CLOUD_CONNECTIONS_SUCCESS: {
        const clouds = action.payload;
        return {
            ...state,
            clouds,
        }
    }
    case api.LIST_CLOUD_CONNECTIONS_FAILURE: {
        return state;
    }

    case api.CREATE_CLOUD_CONNECTION_REQUEST: {
        return {
            ...state,
            cloudErrors: initialState.cloudErrors,
        }
    }
    case api.CREATE_CLOUD_CONNECTION_SUCCESS: {
        const newCloudConnection = action.payload;

        return {
            ...state,
            clouds: [
                ...state.clouds,
                newCloudConnection,
            ],
            cloudErrors: initialState.cloudErrors,
        }
    }
    case api.CREATE_CLOUD_CONNECTION_FAILURE: {
        return {
            ...state,
            cloudErrors: action.payload.response.errors,
        }
    }

    case api.UPDATE_CLOUD_CONNECTION_REQUEST: {
        return {
            ...state,
            cloudErrors: initialState.cloudErrors,
        }
    }
    case api.UPDATE_CLOUD_CONNECTION_SUCCESS: {
        const cloudConnection = action.payload;
        const clouds = [...state.clouds]
        const index = clouds.findIndex(d => d.id === cloudConnection.id)
        clouds[index] = cloudConnection;

        return {
            ...state,
            clouds,
            cloudErrors: initialState.cloudErrors,
        }
    }

    case api.UPDATE_CLOUD_CONNECTION_FAILURE: {
        return {
            ...state,
            cloudErrors: action.payload.response.errors,
        }
    }

    case api.VERIFY_CLOUD_CONNECTION_REQUEST: {
        return {
            ...state,
            cloudConnectionVerification: {
                loading: true,
                success: null,
            },
            cloudErrors: initialState.cloudErrors,
        }
    }
    case api.VERIFY_CLOUD_CONNECTION_SUCCESS: {
        return {
            ...state,
            cloudConnectionVerification: {
                loading: false,
                success: true,
            },
        }
    }
    case api.VERIFY_CLOUD_CONNECTION_FAILURE: {
        return {
            ...state,
            cloudConnectionVerification: {
                loading: false,
                success: false,
            },
            cloudErrors: action.payload.response.errors,
        }
    }
    case dialog.HIDE_NEW_CLOUD_CONNECTION_DIALOG:
    case dialog.HIDE_EDIT_CLOUD_CONNECTION_DIALOG:
    case dialog.SHOW_NEW_CLOUD_CONNECTION_DIALOG:
    case dialog.SHOW_EDIT_CLOUD_CONNECTION_DIALOG:
    {
        return {
            ...state,
            cloudConnectionVerification: initialState.cloudConnectionVerification,
            cloudErrors: initialState.cloudErrors,
        }
    }


    case dialog.HIDE_NEW_CLOUD_CONNECTION_DIALOG:
    case dialog.HIDE_EDIT_CLOUD_CONNECTION_DIALOG:
    {
        return {
            ...state,
            cloudErrors: initialState.cloudErrors,
        }
    }

    case api.DELETE_CLOUD_CONNECTION_REQUEST: {
        return state;
    }
    case api.DELETE_CLOUD_CONNECTION_SUCCESS: {
        const deletedCloudConnection = action.payload;

        return {
            ...state,
            clouds: state.clouds.filter(d => d.id !== deletedCloudConnection.id),
        }
    }
    case api.DELETE_CLOUD_CONNECTION_FAILURE: {
        return state;
    }

    case auth.LOGOUT_REQUEST: {
        return initialState;
    }

    default:
        return state;
    }
};
