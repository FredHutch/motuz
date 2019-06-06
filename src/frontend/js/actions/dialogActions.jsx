import upath from 'upath'

import {
    getSide,
    getOtherSide,
    getCurrentPane,
    setCurrentPane,
    getCurrentFiles,
    setCurrentFiles,
} from 'managers/paneManager.jsx'

export const SHOW_COPY_JOB_DIALOG = '@@dialog/SHOW_COPY_JOB_DIALOG';
export const HIDE_COPY_JOB_DIALOG = '@@dialog/HIDE_COPY_JOB_DIALOG';

export const SHOW_NEW_CLOUD_CONNECTION_DIALOG = '@@dialog/SHOW_NEW_CLOUD_CONNECTION_DIALOG';
export const HIDE_NEW_CLOUD_CONNECTION_DIALOG = '@@dialog/HIDE_NEW_CLOUD_CONNECTION_DIALOG';

export const SHOW_EDIT_CLOUD_CONNECTION_DIALOG = '@@dialog/SHOW_EDIT_CLOUD_CONNECTION_DIALOG';
export const HIDE_EDIT_CLOUD_CONNECTION_DIALOG = '@@dialog/HIDE_EDIT_CLOUD_CONNECTION_DIALOG';


export const showCopyJobDialog = () => {
    return async (dispatch, getState) => {
        const state = getState().pane;

        const srcSide = getSide(state);
        const srcPane = getCurrentPane(state, srcSide);
        const srcFiles = getCurrentFiles(state, srcSide);
        const srcResourceName = srcFiles[srcPane.fileFocusIndex].name;
        const srcResources = upath.join(srcPane.path, srcResourceName)

        const dstSide = getOtherSide(srcSide);
        const dstPane = getCurrentPane(state, dstSide)


        const data = {
            source_cloud: {
                name: srcPane.host,
            },
            source_resource: srcResources,
            destination_cloud: {
                name: dstPane.host
            },
            destination_path: dstPane.path,
            owner: 'aicioara',
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
