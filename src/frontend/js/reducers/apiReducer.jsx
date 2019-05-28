import * as api from 'actions/apiActions.jsx';


const DUMMY_JOBS = [
    {
        'id': 10,
        'description': 'Copy Job number 10',
        'start_time': new Date(new Date() - 100000000),
        'finish_time': null,
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'PROGRESS',
        'progress': 45,
    },
    {
        'id': 11,
        'description': 'Copy Job number 11',
        'start_time': new Date(new Date() - 100000000),
        'finish_time': null,
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'PROGRESS',
        'progress': 60,
    },
    {
        'id': 12,
        'description': 'Copy Job number 12',
        'start_time': new Date(new Date() - 100000000),
        'finish_time': null,
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'PROGRESS',
        'progress': 23,
    },
    {
        'id': 13,
        'description': 'Copy Job number 13',
        'start_time': new Date(new Date() - 100000000),
        'finish_time': new Date(),
        'from_uri': 'localhost:~/tmp',
        'to_uri': 'localhost:~/dev/usr/bin',
        'status': 'FINISHED',
        'progress': 100,
    },
]

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
        return {
            ...state,
            jobs: action.payload,
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
                ...state.jobs,
                newJob,
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
