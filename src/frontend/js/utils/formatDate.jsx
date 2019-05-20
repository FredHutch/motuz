import strftime from 'strftime';

export default function formatDate(d) {
    if (d == null) {
        return '';
    }
    if (! d instanceof Date) {
        console.error("Could not format date", d)
        return '';
    }
    return strftime('%b %d %H:%M:%S', d)
}