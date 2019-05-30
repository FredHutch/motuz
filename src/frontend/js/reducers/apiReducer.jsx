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
    default:
        return state;
    }
};
