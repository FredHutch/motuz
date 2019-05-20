import * as template from 'actions/templateAction.jsx';

const MAX_HISTORY_SIZE = 20;

const INITIAL_PANE = {
    host: 'localhost',
    path: '~',
    sortingColumn: 'Name',
    sortingAsc: true,
    fileFocusIndex: 0,
    history: [],
    fileSelectedIndexes: {},
}

const DUMMY_FILES = [
    {
        'name': '..',
        'size': 'Folder',
        'type': 'dir',
    },
    {
        'name': 'gridstore',
        'size': 'Folder',
        'type': 'dir',
    },
    {
        'name': 'scratch',
        'size': 'Folder',
        'type': 'dir',
    },
    {
        'name': 'SFU-find-utils.tar.gz',
        'size': 628110,
        'type': 'file',
    },
    {
        'name': 'test.iso',
        'size': 4050000000,
        'type': 'file',
    },
]

const initialState = {
    homeDir: '~',
    showHiddenFiles: false,
    focusPaneLeft: false,
    indexes: {
        left: 0,
        right: 0,
    },
    panes: {
        left: [INITIAL_PANE],
        right: [INITIAL_PANE],
    },
    files: {
        left: [...DUMMY_FILES],
        right: [...DUMMY_FILES],
    },
};

export default (state=initialState, action) => {
    switch(action.type) {
    default:
        return state;
    }
};
