import * as api from 'actions/apiActions.jsx';
import reverseArray from 'utils/reverseArray.jsx';

const initialState = {
    clouds: [],
    jobs: [],
};


export default (state=initialState, action) => {
    switch(action.type) {
    case api.LIST_COPY_JOBS_REQUEST: {
        return state;
    }
    case api.LIST_COPY_JOBS_SUCCESS: {
        const jobs = action.payload;
        return {
            ...state,
            jobs: reverseArray(jobs),
        }
    }
    case api.LIST_COPY_JOBS_FAILURE: {
        return state;
    }
    case api.RETRIEVE_COPY_JOB_REQUEST: {
        return state;
    }
    case api.RETRIEVE_COPY_JOB_SUCCESS: {
        return state;
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
        return state;
    }
    case api.CREATE_CLOUD_CONNECTION_SUCCESS: {
        const newCloudConnection = action.payload;

        return {
            ...state,
            clouds: [
                ...state.clouds,
                newCloudConnection,
            ],
        }
    }
    case api.CREATE_CLOUD_CONNECTION_FAILURE: {
        return state;
    }

    case api.UPDATE_CLOUD_CONNECTION_REQUEST: {
        return state;
    }
    case api.UPDATE_CLOUD_CONNECTION_SUCCESS: {
        const cloudConnection = action.payload;
        const clouds = [...state.clouds]
        const index = clouds.findIndex(d => d.id === cloudConnection.id)
        clouds[index] = cloudConnection;

        return {
            ...state,
            clouds,
        }
    }
    case api.UPDATE_CLOUD_CONNECTION_FAILURE: {
        return state;
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


    default:
        return state;
    }
};
