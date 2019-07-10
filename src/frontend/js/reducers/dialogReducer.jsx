import * as auth from 'actions/authActions.jsx';
import * as dialog from 'actions/dialogActions.jsx';
import * as api from 'actions/apiActions.jsx';

const initialState = {
    displayNewCopyJobDialog: false,
    newCopyJobDialogData: {
        source_cloud: {name: 'ERROR'},
        src_resource_path: 'ERROR',
        destination_cloud: {name: 'ERROR'},
        destination_path: 'ERROR',
        owner: 'ERROR',
    },

    displayEditCopyJobDialog: false,
    editCopyJobDialogData: {},

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

    case dialog.SHOW_NEW_COPY_JOB_DIALOG: {
        return {
            ...state,
            displayNewCopyJobDialog: true,
            newCopyJobDialogData: {
                ...state.newCopyJobDialogData,
                ...action.payload.data,
            }
        }
    }

    case dialog.HIDE_NEW_COPY_JOB_DIALOG: {
        return {
            ...state,
            displayNewCopyJobDialog: false,
        }
    }

    case dialog.SHOW_EDIT_COPY_JOB_DIALOG:
    case api.RETRIEVE_COPY_JOB_SUCCESS:
    case api.STOP_COPY_JOB_SUCCESS:
    {
        if (
            state.editCopyJobDialogData.progress_state === 'STOPPED' &&
            action.payload.progress_state === 'PROGRESS'
        ) {
            // TODO: This is a bit of a hack
            // Do not overwrite STOPPED due to race condition
            return state;
        }

        return {
            ...state,
            displayEditCopyJobDialog: true,
            editCopyJobDialogData: action.payload,
        }
    }

    case dialog.HIDE_EDIT_COPY_JOB_DIALOG:
    {
        return {
            ...state,
            displayEditCopyJobDialog: false,
            editCopyJobDialogData: initialState.editCopyJobDialogData,
        }
    }

    case api.CREATE_COPY_JOB_SUCCESS: {
        return {
            ...state,
            displayNewCopyJobDialog: false,
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

    case auth.LOGOUT_REQUEST: {
        return initialState;
    }

    default:
        return state;
    }
};
