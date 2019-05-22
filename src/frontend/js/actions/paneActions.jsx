import * as api from 'actions/apiActions.jsx';

export const FILE_FOCUS_INDEX = '@@pane/FILE_FOCUS_INDEX';
export const DIRECTORY_CHANGE = '@@pane/DIRECTORY_CHANGE';


export const fileFocusIndex = (side, index) => ({
    type: FILE_FOCUS_INDEX,
    payload: {side, index},
});


export const directoryChange = (side=null, path) => {
    return async (dispatch, getState) => {
        dispatch({
            type: DIRECTORY_CHANGE,
            payload: {side, path}
        })
        dispatch(api.listFiles(path));
    }
}
