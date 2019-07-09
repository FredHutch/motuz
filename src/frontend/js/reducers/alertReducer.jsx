import * as auth from 'actions/authActions.jsx';
import * as api from 'actions/apiActions.jsx';
import * as alert from 'actions/alertActions.jsx';

const initialState = {
    show: false,
    text: '',
};


export default (state=initialState, action) => {
    switch(action.type) {
    case alert.HIDE_ALERT: {
        return initialState;
    }

    // case auth.LOGIN_FAILURE: // We do not want to show alert for that
    case auth.REFRESH_TOKEN_FAILURE:

    case api.LIST_FILES_FAILURE:
    case api.LIST_COPY_JOBS_FAILURE:
    case api.RETRIEVE_COPY_JOB_FAILURE:
    case api.CREATE_COPY_JOB_FAILURE:
    case api.STOP_COPY_JOB_FAILURE:
    case api.LIST_CLOUD_CONNECTIONS_FAILURE:
    case api.CREATE_CLOUD_CONNECTION_FAILURE:
    case api.UPDATE_CLOUD_CONNECTION_FAILURE:
    case api.DELETE_CLOUD_CONNECTION_FAILURE:
    case api.MAKE_DIRECTORY_FAILURE:
    {
        return {
            ...state,
            show: true,
            text: action.payload.response || action.payload,
        };
    }

    case auth.LOGOUT_REQUEST: {
        return initialState;
    }

    default:
        return state;
    }
};
