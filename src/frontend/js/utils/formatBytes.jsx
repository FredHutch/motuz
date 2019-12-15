const UNIT_SIZES = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
const SI_UNIT_SIZES = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export default function formatBytes(d, useSiUnits=false) {
    const unitSizes = useSiUnits ? SI_UNIT_SIZES : UNIT_SIZES
    const base = useSiUnits ? 1000 : 1024

    if (typeof d !== 'number') {
        d = window.parseInt(d)
        if (Number.isNaN(d)) {
            return '0 B';
        }
    }
    let magnitude = 0;
    while (d >= base) {
        d /= base
        magnitude += 1
    }
    d = Math.round(d);
    return `${d} ${unitSizes[magnitude]}`;
}