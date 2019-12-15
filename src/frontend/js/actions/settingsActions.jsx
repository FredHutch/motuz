export const UPDATE_SETTINGS_REQUEST = '@@settings/UPDATE_SETTINGS_REQUEST';

export const updateSettings = (data) => ({
    type: UPDATE_SETTINGS_REQUEST,
    payload: {data},
});
