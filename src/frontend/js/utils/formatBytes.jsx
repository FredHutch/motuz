const UNIT_SIZES = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

export default function formatBytes(d) {
    if (typeof d !== 'number') {
        d = window.parseInt(d)
        if (Number.isNaN(d)) {
            return '0 B';
        }
    }
    let magnitude = 0;
    while (d >= 1024) {
        d = Math.floor(d / 1024);
        magnitude += 1
    }
    return `${d} ${UNIT_SIZES[magnitude]}`;
}