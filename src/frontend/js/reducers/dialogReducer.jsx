import * as dialog from 'actions/dialogActions.jsx';

const SOURCE_CLOUD = {
    name: 'localhost',
}

const DESTINATION_CLOUD = {
    name: 'localhost',
}

const initialState = {
    displayCopyJobDialog: true,
    copyJobDialogData: {
        sourceCloud: SOURCE_CLOUD,
        sourceResource: '/Users/aicioara/tmp',
        destinationCloud: DESTINATION_CLOUD,
        destinationPath: '/tmp',
        owner: 'aicioara',
    },
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
