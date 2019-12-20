import * as api from 'actions/apiActions.jsx';
import { getCurrentPane } from 'managers/paneManager.jsx'

export const SIDE_FOCUS = '@@pane/SIDE_FOCUS';
export const FILE_FOCUS_INDEX = '@@pane/FILE_FOCUS_INDEX';
export const DIRECTORY_CHANGE = '@@pane/DIRECTORY_CHANGE';
export const HOST_CHANGE = '@@pane/HOST_CHANGE';


export const fileFocusIndex = (side, index) => ({
    type: FILE_FOCUS_INDEX,
    payload: {side, index},
});


export const sideFocus = (side) => ({
    type: SIDE_FOCUS,
    payload: {side},
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
            settings: state.settings,
        }))
    }
}

export const initPanes = () => {
    return async (dispatch, getState) => {
        const state = getState()

        return await dispatch(api.listHomeFiles({
            settings: state.settings,
        }))
    }
}

export const directoryChange = (side=null, path) => {
    return async (dispatch, getState) => {
        const state = getState();
        const pane = getCurrentPane(state.pane, side);
        const host = pane.host;

        if (path === '.' || path === '') {
            path = '/'
        }

        dispatch({
            type: DIRECTORY_CHANGE,
            payload: {side, path}
        })
        return await dispatch(api.listFiles(side, {
            connection_id: host.id,
            path,
            settings: state.settings,
        }));
    }
}

export const refreshPanes = () => {
    return async (dispatch, getState) => {
        const state = getState();

        const pathLeft = state.pane.panes.left[0].path;
        const pathRight = state.pane.panes.right[0].path;

        await Promise.all([
            dispatch(directoryChange('left', pathLeft)),
            dispatch(directoryChange('right', pathRight)),
        ]);
    }
}
