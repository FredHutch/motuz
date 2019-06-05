
/**
 * files: {
 *     name,
 *     size,
 *     type
 * }
 */
export function sortFiles(files, showHiddenFiles=true) {
    if (!showHiddenFiles) {
        files = files.filter(d => !d.name.startsWith('.'))
    }

    files = _sortFiles(files, nameSortFunctor, true)

    return files;
}

function _sortFiles(files, sortFunctor, sortingAsc) {
    const direction = sortingAsc ? 1 : -1;

    return files
        .sort((a, b) => {
            if (a.type === 'dir' && b.type !== 'dir') {
                return -1;
            } else if (a.type !== 'dir' && b.type === 'dir') {
                return 1;
            }
            return sortFunctor(a, b) * direction;
        })
}


const nameSortFunctor = (a, b) => {
    const aProp = a.name.toLowerCase();
    const bProp = b.name.toLowerCase();
    if (aProp < bProp) {
        return -1;
    } else if (aProp > bProp) {
        return 1;
    } else {
        return 0;
    }
}

