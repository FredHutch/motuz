import * as dialog from 'actions/dialogActions.jsx';

const initialState = {
    displayCopyJobDialog: false,
};

export default (state=initialState, action) => {
    switch(action.type) {
    case dialog.SHOW_COPY_JOB_DIALOG: {
        return {
            ...state,
            displayCopyJobDialog: true,
        }
    }
    case dialog.HIDE_COPY_JOB_DIALOG: {
        return {
            ...state,
            displayCopyJobDialog: false,
        }
    }
    default:
        return state;
    }
};
