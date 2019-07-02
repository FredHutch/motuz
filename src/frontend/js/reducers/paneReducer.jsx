import * as pane from 'actions/paneActions.jsx';
import * as api from 'actions/apiActions.jsx';

import fileManager from 'managers/fileManager.jsx'
import {
    getSide,
    getOtherSide,
    getCurrentPane,
    setCurrentPane,
    getCurrentFiles,
    setCurrentFiles,
} from 'managers/paneManager.jsx';


const INITIAL_PANE = {
    host: {
        id: 0,
        name: '127.0.0.1',
        type: 'localhost',
        access_key_id: '',
        access_key_secret: '',
        region: '',
    },
    path: '/',
    sortingColumn: 'name',
    sortingAsc: true,
    fileFocusIndex: 0,
    history: [],
    fileSelectedIndexes: {},
}

const initialState = {
    homeDir: '~',
    showHiddenFiles: false,
    focusPaneLeft: true,
    indexes: {
        left: 0,
        right: 0,
    },
    panes: {
        left: [INITIAL_PANE],
        right: [INITIAL_PANE],
    },
    files: {
        left: [],
        right: [],
    },
};

export default (state=initialState, action) => {
    switch(action.type) {
    case pane.FILE_FOCUS_INDEX: {
        const index = action.payload.index;
        const side = action.payload.side || getSide(state);
        const focusPaneLeft = side === 'left';
        return {
            ...state,
            focusPaneLeft,
            panes: {
                ...setCurrentPane(state, {
                    ...getCurrentPane(state, side),
                    fileFocusIndex: index,
                }, side)
            }
        }
    }
    case pane.DIRECTORY_CHANGE: {
        const { side, path } = action.payload;

        return {
            ...state,
            panes: {
                ...setCurrentPane(state, {
                    ...getCurrentPane(state, side),
                    fileFocusIndex: 0,
                    path,
                }, side)
            },
            files: {
                ...setCurrentFiles(
                    state,
                    [
                        {name: '..', type: 'dir'},
                        {name: "Loading..."},
                    ],
                    side,
                )
            }
        }
    }

    case pane.HOST_CHANGE: {
        const {side, host} = action.payload;

        let path = '/'
        if (host.type === 's3' && host.bucket) {
            path = `/${host.bucket}`;
        }

        return {
            ...state,
            panes: {
                ...setCurrentPane(state, {
                    ...getCurrentPane(state, side),
                    fileFocusIndex: 0,
                    path,
                    host,
                }, side)
            },
            files: {
                ...setCurrentFiles(
                    state,
                    [
                        {name: '..', type: 'dir'},
                        {name: "Loading..."},
                    ],
                    side,
                )
            }
        }
    }


    case pane.TOGGLE_SHOW_HIDDEN_FILES: {
        return {
            ...state,
            showHiddenFiles: !state.showHiddenFiles,
        }
    }

    case api.LIST_FILES_REQUEST: {
        return {
            ...state,
        }
    }
    case api.LIST_FILES_SUCCESS: {
        const { payload } = action;
        const { side, data } = action.meta;
        const { type, path } = data;

        const { showHiddenFiles } = state;

        let files = action.payload;

        if (type === 'localhost') {
            files = fileManager.convertLocalFilesToMotuz(files)
        } else if (type === 's3' || type === 'azureblob') {
            files = fileManager.convertRcloneFilesToMotuz(files)
        } else {
            console.error(`Unknown payload type ${type}`);
        }

        files = fileManager.filterFiles(files, {
            showHiddenFiles: state.showHiddenFiles,
        })
        files = fileManager.sortFiles(files);

        // Convert `rclone` files to `motuz`

        if (path !== '/') {
            files.unshift({
                'name': '..',
                'size': 'Folder',
                'type': 'dir',
            })
        }
        return {
            ...state,
            files: {
                ...setCurrentFiles(state, files, side),
            },
        }
    }
    case api.LIST_FILES_FAILURE: {
        const { payload } = action;
        const { side } = action.meta;

        return {
            ...state,
            files: {
                ...setCurrentFiles(
                    state,
                    [
                        {name: '..', type: 'dir'},
                        {name: "ERROR - CHECK THE CONSOLE"},
                    ],
                    side,
                ),
            },
        }
    }

    default:
        return state;
    }
};
