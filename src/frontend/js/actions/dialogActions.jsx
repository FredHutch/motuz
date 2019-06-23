import upath from 'upath'

import {
    getSide,
    getOtherSide,
    getCurrentPane,
    setCurrentPane,
    getCurrentFiles,
    setCurrentFiles,
} from 'managers/paneManager.jsx'
import { getCurrentUser } from 'reducers/authReducer.jsx';

export const SHOW_COPY_JOB_DIALOG = '@@dialog/SHOW_COPY_JOB_DIALOG';
export const HIDE_COPY_JOB_DIALOG = '@@dialog/HIDE_COPY_JOB_DIALOG';

export const SHOW_COPY_JOB_EDIT_DIALOG = '@@dialog/SHOW_COPY_JOB_EDIT_DIALOG';
export const HIDE_COPY_JOB_EDIT_DIALOG = '@@dialog/HIDE_COPY_JOB_EDIT_DIALOG';

export const SHOW_NEW_CLOUD_CONNECTION_DIALOG = '@@dialog/SHOW_NEW_CLOUD_CONNECTION_DIALOG';
export const HIDE_NEW_CLOUD_CONNECTION_DIALOG = '@@dialog/HIDE_NEW_CLOUD_CONNECTION_DIALOG';

export const SHOW_EDIT_CLOUD_CONNECTION_DIALOG = '@@dialog/SHOW_EDIT_CLOUD_CONNECTION_DIALOG';
export const HIDE_EDIT_CLOUD_CONNECTION_DIALOG = '@@dialog/HIDE_EDIT_CLOUD_CONNECTION_DIALOG';


export const showCopyJobDialog = () => {
    return async (dispatch, getState) => {
        const state = getState();

        const srcSide = getSide(state.pane);
        const srcPane = getCurrentPane(state.pane, srcSide);
        const srcFiles = getCurrentFiles(state.pane, srcSide);
        const srcResourceName = srcFiles[srcPane.fileFocusIndex].name;
        const srcResources = upath.join(srcPane.path, srcResourceName)

        const dstSide = getOtherSide(srcSide);
        const dstPane = getCurrentPane(state.pane, dstSide)

        const data = {
            source_cloud: srcPane.host,
            source_resource: srcResources,
            destination_cloud: dstPane.host,
            destination_path: dstPane.path,
            owner: getCurrentUser(state.auth),
        }

        dispatch({
            type: SHOW_COPY_JOB_DIALOG,
            payload: {data}
        })
    }
};

export const hideCopyJobDialog = () => ({
    type: HIDE_COPY_JOB_DIALOG,
});


export const showCopyJobEditDialog = (jobId) => ({
    type: SHOW_COPY_JOB_EDIT_DIALOG,
    payload: {data: {id: jobId}},
});

export const hideCopyJobEditDialog = () => ({
    type: HIDE_COPY_JOB_EDIT_DIALOG,
});


export const showNewCloudConnectionDialog = () => ({
    type: SHOW_NEW_CLOUD_CONNECTION_DIALOG,
});

export const hideNewCloudConnectionDialog = () => ({
    type: HIDE_NEW_CLOUD_CONNECTION_DIALOG,
});


export const showEditCloudConnectionDialog = (data) => ({
    type: SHOW_EDIT_CLOUD_CONNECTION_DIALOG,
    payload: data,
});

export const hideEditCloudConnectionDialog = () => ({
    type: HIDE_EDIT_CLOUD_CONNECTION_DIALOG,
});
