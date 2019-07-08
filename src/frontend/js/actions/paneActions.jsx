import * as api from 'actions/apiActions.jsx';
import { getCurrentPane } from 'managers/paneManager.jsx'

export const FILE_FOCUS_INDEX = '@@pane/FILE_FOCUS_INDEX';
export const DIRECTORY_CHANGE = '@@pane/DIRECTORY_CHANGE';
export const HOST_CHANGE = '@@pane/HOST_CHANGE';
export const TOGGLE_SHOW_HIDDEN_FILES = '@@pane/TOGGLE_SHOW_HIDDEN_FILES';


export const fileFocusIndex = (side, index) => ({
    type: FILE_FOCUS_INDEX,
    payload: {side, index},
});


export const hostChange = (side=null, host) => {
    return async (dispatch, getState) => {
        await dispatch({
            type: HOST_CHANGE,
            payload: {side, host},
        })

        const state = getState();
        const pane = getCurrentPane(state.pane, side)

        // TODO: Change this
        return await dispatch(api.listFiles(side, {
            connection_id: host.id,
            path: pane.path,
        }))
    }
}

export const directoryChange = (side=null, path) => {
    return async (dispatch, getState) => {
        const state = getState();
        const pane = getCurrentPane(state.pane, side);
        const host = pane.host;

        if (host.id !== 0) {
            // Cloud paths should not have a leading slash
            path = path.replace(/^\/+/, '') || '/'
        }

        dispatch({
            type: DIRECTORY_CHANGE,
            payload: {side, path}
        })
        return await dispatch(api.listFiles(side, {
            connection_id: host.id,
            path,
        }));
    }
}

export const refreshPanes = () => {
    return async (dispatch, getState) => {
        const state = getState();

        const pathLeft = state.pane.panes.left[0].path;
        const pathRight = state.pane.panes.right[0].path;

        const hostLeft = state.pane.panes.left[0].host.id;
        const hostRight = state.pane.panes.right[0].host.id;

        if (pathLeft === pathRight && hostLeft === hostRight) { // optimization
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