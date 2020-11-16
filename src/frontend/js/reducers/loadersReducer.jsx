import * as api from 'actions/apiActions.jsx';

const initialState = {
    createCopyJobLoading: false,
    createHashsumJobLoading: false,
};

export default (state=initialState, action) => {
    switch(action.type) {

    case api.CREATE_COPY_JOB_REQUEST: {
        return {...state, createCopyJobLoading: true };
    }
    case api.CREATE_COPY_JOB_SUCCESS:
    case api.CREATE_COPY_JOB_FAILURE: {
        return {...state, createCopyJobLoading: false };
    }

    case api.CREATE_HASHSUM_JOB_REQUEST: {
        return {...state, createHashsumJobLoading: true };
    }
    case api.CREATE_HASHSUM_JOB_SUCCESS:
    case api.CREATE_HASHSUM_JOB_FAILURE: {
        return {...state, createHashsumJobLoading: false };
    }

    default:
        return state;
    }
};
