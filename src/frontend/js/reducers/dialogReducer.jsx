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
        source_resource: 'ERROR',
        destination_cloud: DESTINATION_CLOUD,
        destination_path: 'ERROR',
        owner: 'ERROR',
    },

    displayCopyJobEditDialog: false,
    copyJobEditDialogData: {},

    displayNewCloudConnectionDialog: false,
    newCloudConnectionDialogData: {
        verifySuccess: false,
        verifyLoading: false,
        verifyFinished: false,
    },

    displayEditCloudConnectionDialog: false,
    editCloudConnectionDialogData: {},

    displayMkdirDialog: false,
    mkdirDialogData: {
        loading: false,
    },
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

    case dialog.SHOW_COPY_JOB_EDIT_DIALOG: {
        return {
            ...state,
            displayCopyJobEditDialog: true,
            copyJobEditDialogData: action.payload.data,
        }
    }

    case dialog.HIDE_COPY_JOB_EDIT_DIALOG:
    case api.STOP_COPY_JOB_SUCCESS:
    {
        return {
            ...state,
            displayCopyJobEditDialog: false,
        }
    }

    case api.CREATE_COPY_JOB_SUCCESS: {
        return {
            ...state,
            displayCopyJobDialog: false,
        }
    }

    case dialog.SHOW_NEW_CLOUD_CONNECTION_DIALOG: {
        return {
            ...state,
            displayNewCloudConnectionDialog: true,
        }
    }

    case dialog.HIDE_NEW_CLOUD_CONNECTION_DIALOG:
    case api.CREATE_CLOUD_CONNECTION_SUCCESS: {
        return {
            ...state,
            displayNewCloudConnectionDialog: false,
        }
    }

    case dialog.SHOW_EDIT_CLOUD_CONNECTION_DIALOG: {
        return {
            ...state,
            displayEditCloudConnectionDialog: true,
            editCloudConnectionDialogData: {
                ...action.payload,
            },
        }
    }

    case dialog.HIDE_EDIT_CLOUD_CONNECTION_DIALOG:
    case api.UPDATE_CLOUD_CONNECTION_SUCCESS:
    case api.DELETE_CLOUD_CONNECTION_SUCCESS: {
        return {
            ...state,
            displayEditCloudConnectionDialog: false,
        }
    }

    case api.VERIFY_CLOUD_CONNECTION_REQUEST: {
        return {
            ...state,
            newCloudConnectionDialogData: {
                ...state.newCloudConnectionDialogData,
                verifyLoading: true,
                verifyFinished: false,
            }
        }
    }

    case api.VERIFY_CLOUD_CONNECTION_SUCCESS: {
        const {result} = action.payload;

        return {
            ...state,
            newCloudConnectionDialogData: {
                ...state.newCloudConnectionDialogData,
                verifyLoading: false,
                verifyFinished: true,
                verifySuccess: result,
            }
        }
    }

    case api.VERIFY_CLOUD_CONNECTION_FAILURE: {
        return {
            ...state,
            newCloudConnectionDialogData: {
                ...state.newCloudConnectionDialogData,
                verifyLoading: false,
                verifyFinished: true,
                verifySuccess: false,
            }
        }
    }


    case dialog.SHOW_MKDIR_DIALOG: {
        return {
            ...state,
            displayMkdirDialog: true,
            mkdirDialogData: {
                ...state.mkdirDialogData,
                ...action.payload.data,
            }
        }
    }

    case dialog.HIDE_MKDIR_DIALOG: {
        return {
            ...state,
            displayMkdirDialog: false,
            mkdirDialogData: initialState.mkdirDialogData,
        }
    }

    case api.MAKE_DIRECTORY_REQUEST: {
        return {
            ...state,
            mkdirDialogData: {
                ...state.mkdirDialogData,
                loading: true,
            }
        }
    }
    case api.MAKE_DIRECTORY_SUCCESS:
    case api.MAKE_DIRECTORY_FAILURE:
    {
        return {
            ...state,
            mkdirDialogData: {
                ...state.mkdirDialogData,
                loading: false,
            }
        }
    }



    default:
        return state;
    }
};
