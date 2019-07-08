import upath from 'upath'


export function getSide(state) {
    if (state.focusPaneLeft) {
        return 'left';
    } else {
        return 'right';
    }
}

export function getOtherSide(side) {
    if (side === 'left') {
        return 'right'
    } else if (side === 'right') {
        return 'left'
    } else {
        console.error("Unknown side", side)
        return 'left';
    }
}

export function getCurrentPane(state, side=null) {
    if (!side) {
        side = getSide(state);
    }
    const index = state.indexes[side]
    return state.panes[side][index]
}

export function setCurrentPane(state, payload, side=null) {
    if (!side) {
        side = getSide(state);
    }
    const index = state.indexes[side]
    const panes = state.panes[side].slice()
    panes[index] = payload
    return {
        ...state.panes,
        [side]: panes,
    }
}

export function getCurrentFiles(state, side=null) {
    if (!side) {
        side = getSide(state);
    }
    return state.files[side]
}

export function setCurrentFiles(state, payload, side=null) {
    if (!side) {
        side = getSide(state);
    }
    return {
        ...state.files,
        [side]: payload,
    }
}

export function fileExists(state, dirname, basename) {
    let files;
    if (getCurrentPane(state, 'left').path === dirname) {
        files = getCurrentFiles(state, 'left');
    } else if (getCurrentPane(state, 'right').path === dirname) {
        files = getCurrentFiles(state, 'right');
    } else {
        console.error(`Neither left nor right pane has path '${dirname}'`)
        return false; // Fail safe
    }

    return files.some(d => d.name === basename);
}
