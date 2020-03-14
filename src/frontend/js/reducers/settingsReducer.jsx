import * as settings from 'actions/settingsActions.jsx';

const initialState = {
    showHiddenFiles: false,
    useSiUnits: false,
    followSymlinks: false,
    emailNotifications: false,
    emailAddress: "",
};


export default (state=initialState, action) => {
    switch(action.type) {
    case settings.UPDATE_SETTINGS_REQUEST: {
        return {
            ...state,
            ...action.payload.data,
        }
    }

    default:
        return state;
    }
};
