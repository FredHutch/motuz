export const FILE_FOCUS_INDEX = '@@pane/FILE_FOCUS_INDEX';


export const fileFocusIndex = (side, index) => ({
    type: FILE_FOCUS_INDEX,
    payload: {side, index},
});
