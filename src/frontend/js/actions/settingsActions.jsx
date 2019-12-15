import * as pane from 'actions/paneActions.jsx';


export const UPDATE_SETTINGS_REQUEST = '@@settings/UPDATE_SETTINGS_REQUEST';

export const updateSettings = (data) => {
    return async (dispatch, getState) => {
        dispatch({
            type: UPDATE_SETTINGS_REQUEST,
            payload: {data},
        })

        dispatch(pane.refreshPanes());
    }
}
