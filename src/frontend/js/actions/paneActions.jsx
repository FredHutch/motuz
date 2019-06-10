import * as api from 'actions/apiActions.jsx';

export const FILE_FOCUS_INDEX = '@@pane/FILE_FOCUS_INDEX';
export const DIRECTORY_CHANGE = '@@pane/DIRECTORY_CHANGE';
export const HOST_CHANGE = '@@pane/HOST_CHANGE';
export const TOGGLE_SHOW_HIDDEN_FILES = '@@pane/TOGGLE_SHOW_HIDDEN_FILES';


export const fileFocusIndex = (side, index) => ({
    type: FILE_FOCUS_INDEX,
    payload: {side, index},
});


export const hostChange = (side=null, host) => {
    return {
        type: HOST_CHANGE,
        payload: {side, host},
    }
}

export const directoryChange = (side=null, path) => {
    return async (dispatch, getState) => {
        dispatch({
            type: DIRECTORY_CHANGE,
            payload: {side, path}
        })
        return await dispatch(api.listFiles(side, {type: 'localhost', path}));
    }
}

export const refreshPanes = () => {
    return async (dispatch, getState) => {
        const state = getState();

        const pathLeft = state.pane.panes.left[0].path;
        const pathRight = state.pane.panes.right[0].path;

        if (pathLeft === pathRight) { // optimization
            const dirLeft = await dispatch(directoryChange('left', pathLeft));
            const dirRight = {
                ...dirLeft,
                meta: {
                    ...dirLeft.meta,
                    side: 'right',
                }
            }
            dispatch(dirRight)
            return;
        }

        await Promise.all([
            dispatch(directoryChange('left', pathLeft)),
            dispatch(directoryChange('right', pathRight)),
        ]);
    }
}

export const toggleShowHiddenFiles = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: TOGGLE_SHOW_HIDDEN_FILES,
        })

        dispatch(refreshPanes());
    }
}