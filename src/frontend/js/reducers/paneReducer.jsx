import * as pane from 'actions/paneActions.jsx';
import * as api from 'actions/apiActions.jsx';

import { sortFiles } from 'managers/fileManager.jsx'
import {
    getSide,
    getOtherSide,
    getCurrentPane,
    setCurrentPane,
    getCurrentFiles,
    setCurrentFiles,
} from 'managers/paneManager.jsx';


const INITIAL_PANE = {
    host: 'localhost',
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
                    side
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
        const { side, path } = action.meta;

        const { showHiddenFiles } = state;

        const files = sortFiles(payload, showHiddenFiles);
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
