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


