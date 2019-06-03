import * as dialog from 'actions/dialogActions.jsx';
import * as api from 'actions/apiActions.jsx';

const SOURCE_CLOUD = {
    name: 'localhost',
}

const DESTINATION_CLOUD = {
    name: 'localhost',
}

const initialState = {
    displayCopyJobDialog: false,
    copyJobDialogData: {
        source_cloud: SOURCE_CLOUD,
        source_resource: '/Users/aicioara/tmp',
        destination_cloud: DESTINATION_CLOUD,
        destination_path: '/tmp',
        owner: 'aicioara',
    },

    displayCloudConnectionDialog: false,
    cloudConnectionDialogData: {

    }
};

export default (state=initialState, action) => {
    switch(action.type) {
    case dialog.SHOW_COPY_JOB_DIALOG: {
        return {
            ...state,
            displayCopyJobDialog: true,
            copyJobDialogData: {
                ...state.copyJobDialogData,
                ...action.payload.data,
            }
        }
    }
    case dialog.HIDE_COPY_JOB_DIALOG: {
        return {
            ...state,
            displayCopyJobDialog: false,
        }
    }
    case api.CREATE_COPY_JOB_SUCCESS: {
        return {
            ...state,
            displayCopyJobDialog: false,
        }
    }

    case dialog.SHOW_CLOUD_CONNECTION_DIALOG: {
        return {
            ...state,
            displayCloudConnectionDialog: true,
        }
    }
    case dialog.HIDE_CLOUD_CONNECTION_DIALOG: {
        return {
            ...state,
            displayCloudConnectionDialog: false,
        }
    }
    default:
        return state;
    }
};
