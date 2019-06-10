export default {
    convertLocalFilesToMotuz,
    convertRcloneFilesToMotuz,
    filterFiles,
    sortFiles,
}

export function convertLocalFilesToMotuz(files) {
    return files;
}


export function convertRcloneFilesToMotuz(files) {
    return files.map(d => ({
        name: d.Name,
        type: d.IsDir ? 'dir' : 'file',
        size: d.Size,
    }))
    return files;
}

export function filterFiles(files, options) {
    const { showHiddenFiles } = options

    if (!showHiddenFiles) {
        files = files.filter(d => !d.name.startsWith('.'))
    }
    return files;
}


/**
 * files: {
 *     name,
 *     size,
 *     type
 * }
 */
export function sortFiles(files) {
    return _sortFiles(files, nameSortFunctor, true)
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

